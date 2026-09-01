import logging
from typing import Dict, Any, List, Optional
import networkx as nx
from networkx.algorithms import community

logger = logging.getLogger("graph_intelligence")

class GraphIntelligenceEngine:
    """
    Layer 5: Fund-Flow Graph Intelligence Engine.
    Executes Cypher on Neo4j if available, with an internal NetworkX Directed Graph
    for local computing of Louvain Communities, PageRank, and Multi-Hop Mule Rings.
    """
    _instance = None

    def __new__(cls):
        if cls._instance is None:
            cls._instance = super(GraphIntelligenceEngine, cls).__new__(cls)
            cls._instance.nx_graph = nx.DiGraph()
            cls._instance._seed_default_graph()
        return cls._instance

    def _seed_default_graph(self):
        """Seeds realistic multi-layer syndicate nodes and transactions."""
        # Nodes: Victims, Mules Layer 1, Mules Layer 2, ATM Cash-Out accounts
        nodes = [
            ("VIC_ARVIND", {"type": "Victim", "name": "Dr. Arvind Rameshwar", "state": "UP", "district": "Noida", "loss": 4250000.0}),
            ("MULE_L1_01", {"type": "Account", "bank": "State Bank of India", "holder": "CyberSafe Global", "balance": 4250000.0, "is_frozen": False, "layer": 1}),
            ("MULE_L2_01", {"type": "Account", "bank": "ICICI Bank", "holder": "Apex Trade Logistics", "balance": 1850000.0, "is_frozen": False, "layer": 2}),
            ("MULE_L2_02", {"type": "Account", "bank": "Axis Bank", "holder": "Om Retail Enterprises", "balance": 1400000.0, "is_frozen": False, "layer": 2}),
            ("MULE_L2_03", {"type": "Account", "bank": "Canara Bank", "holder": "Shree Fast Solutions", "balance": 1000000.0, "is_frozen": False, "layer": 2}),
            ("ATM_HUB_NOIDA", {"type": "Account", "bank": "HDFC Bank", "holder": "ATM Terminal Aggregator", "balance": 1850000.0, "is_frozen": False, "layer": 3}),
            ("ATM_HUB_GZB", {"type": "Account", "bank": "SBI Mohan Nagar", "holder": "Cash Withdrawal Terminal", "balance": 1400000.0, "is_frozen": False, "layer": 3}),
        ]
        for n_id, attrs in nodes:
            self.nx_graph.add_node(n_id, **attrs)

        edges = [
            ("VIC_ARVIND", "MULE_L1_01", {"amount": 4250000.0, "method": "RTGS", "hop": 1, "txn_ref": "TXN-RTGS-01"}),
            ("MULE_L1_01", "MULE_L2_01", {"amount": 1850000.0, "method": "IMPS", "hop": 2, "txn_ref": "TXN-IMPS-01"}),
            ("MULE_L1_01", "MULE_L2_02", {"amount": 1400000.0, "method": "IMPS", "hop": 2, "txn_ref": "TXN-IMPS-02"}),
            ("MULE_L1_01", "MULE_L2_03", {"amount": 1000000.0, "method": "NEFT", "hop": 2, "txn_ref": "TXN-NEFT-03"}),
            ("MULE_L2_01", "ATM_HUB_NOIDA", {"amount": 1850000.0, "method": "ATM_CARDLESS", "hop": 3, "txn_ref": "TXN-ATM-01"}),
            ("MULE_L2_02", "ATM_HUB_GZB", {"amount": 1400000.0, "method": "ATM_DEBIT", "hop": 3, "txn_ref": "TXN-ATM-02"}),
        ]
        for u, v, attrs in edges:
            self.nx_graph.add_edge(u, v, **attrs)

    def add_transaction(self, sender: str, receiver: str, amount: float, method: str, hop: int = 1, txn_ref: str = ""):
        if not self.nx_graph.has_node(sender):
            self.nx_graph.add_node(sender, type="Account", is_frozen=False, layer=hop-1)
        if not self.nx_graph.has_node(receiver):
            self.nx_graph.add_node(receiver, type="Account", is_frozen=False, layer=hop)
        self.nx_graph.add_edge(sender, receiver, amount=amount, method=method, hop=hop, txn_ref=txn_ref)

    def get_fund_flow_trace(self, start_node: str = "VIC_ARVIND") -> Dict[str, Any]:
        """Traces complete multi-hop fund flow from victim to cash points."""
        if not self.nx_graph.has_node(start_node):
            # Fallback to first victim node if specific id not found
            victims = [n for n, d in self.nx_graph.nodes(data=True) if d.get("type") == "Victim"]
            start_node = victims[0] if victims else list(self.nx_graph.nodes())[0]

        nodes_data = []
        for n in self.nx_graph.nodes():
            d = self.nx_graph.nodes[n]
            nodes_data.append({
                "id": n,
                "label": d.get("name", d.get("holder", n)),
                "type": d.get("type", "Account"),
                "bank": d.get("bank", "N/A"),
                "balance": d.get("balance", 0.0),
                "layer": d.get("layer", 1),
                "is_frozen": d.get("is_frozen", False)
            })

        edges_data = []
        for u, v, d in self.nx_graph.edges(data=True):
            edges_data.append({
                "source": u,
                "target": v,
                "amount": d.get("amount", 0.0),
                "method": d.get("method", "IMPS"),
                "hop": d.get("hop", 1),
                "txn_ref": d.get("txn_ref", "")
            })

        return {
            "root_node": start_node,
            "total_nodes": len(nodes_data),
            "total_edges": len(edges_data),
            "nodes": nodes_data,
            "edges": edges_data
        }

    def compute_pagerank(self, damping: float = 0.85, max_iter: int = 50, tol: float = 1e-6) -> List[Dict[str, Any]]:
        """Computes PageRank Hub Centrality on all mule and hub nodes using power-iteration."""
        nodes = list(self.nx_graph.nodes())
        N = len(nodes)
        if N == 0:
            return []

        # Initialize uniform ranks
        ranks = {n: 1.0 / N for n in nodes}

        for _ in range(max_iter):
            new_ranks = {}
            dangling_sum = sum(ranks[n] for n in nodes if self.nx_graph.out_degree(n) == 0)
            
            for n in nodes:
                # Sum of incoming rank contributions
                in_sum = sum(
                    ranks[pred] / self.nx_graph.out_degree(pred)
                    for pred in self.nx_graph.predecessors(n)
                    if self.nx_graph.out_degree(pred) > 0
                )
                new_ranks[n] = (1.0 - damping) / N + damping * (in_sum + dangling_sum / N)

            # Check convergence
            err = sum(abs(new_ranks[n] - ranks[n]) for n in nodes)
            ranks = new_ranks
            if err < tol:
                break

        sorted_ranks = sorted(ranks.items(), key=lambda x: x[1], reverse=True)
        results = []
        for node_id, score in sorted_ranks:
            node_data = self.nx_graph.nodes.get(node_id, {})
            results.append({
                "account_token": node_id,
                "label": node_data.get("holder", node_data.get("name", node_id)),
                "bank": node_data.get("bank", "N/A"),
                "type": node_data.get("type", "Account"),
                "hub_centrality_score": round(score * 100, 2)
            })
        return results

    def detect_louvain_syndicates(self) -> List[Dict[str, Any]]:
        """Detects syndicate clusters using Louvain Community Detection."""
        undirected = self.nx_graph.to_undirected()
        communities = community.louvain_communities(undirected, weight="amount", seed=42)
        
        clusters = []
        for idx, comm in enumerate(communities):
            members = list(comm)
            total_vol = sum(
                d.get("amount", 0.0) 
                for u, v, d in self.nx_graph.edges(data=True) 
                if u in comm or v in comm
            )
            clusters.append({
                "cluster_id": f"SYN-CLUSTER-{idx + 1:02d}",
                "name": f"Syndicate Ring #{idx + 1}",
                "node_count": len(members),
                "members": members,
                "total_volume_inr": total_vol,
                "risk_tier": "CRITICAL" if total_vol >= 2000000.0 else "ELEVATED"
            })
        return clusters

graph_engine = GraphIntelligenceEngine()
