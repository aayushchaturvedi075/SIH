"""
Layer 5: Cypher query definitions for Neo4j Graph Analytics.
Includes Mule-Ring Detection, Louvain Community Detection, PageRank Centrality, and Layering Paths.
"""

CYPHER_FIND_MULE_RINGS = """
MATCH (source:Account)-[r1:TRANSFERRED_TO]->(mule1:Account)-[r2:TRANSFERRED_TO*1..4]->(target:Account)
WHERE source <> target AND mule1.is_frozen = false
WITH source, target, mule1, r1, r2,
     reduce(total = 0, r in [r1] + r2 | total + r.amount) as total_layer_volume,
     size(r2) + 1 as total_hops
WHERE total_hops >= 2 AND total_layer_volume >= $min_volume
RETURN source.token as source_account,
       target.token as target_cashout_account,
       total_hops as hops_count,
       total_layer_volume as siphoned_volume,
       [r in [r1] + r2 | r.method] as methods
ORDER BY siphoned_volume DESC
LIMIT $limit
"""

CYPHER_TRACE_FUND_FLOW = """
MATCH path = (v:Victim {token: $victim_token})-[:TRANSFERRED_TO*1..5]->(terminus:Account)
WHERE NOT (terminus)-[:TRANSFERRED_TO]->()
RETURN [n in nodes(path) | {
           token: n.token,
           label: labels(n)[0],
           bank: n.bank,
           holder: n.holder_name,
           balance: n.balance,
           is_frozen: n.is_frozen
       }] as nodes,
       [r in relationships(path) | {
           from: startNode(r).token,
           to: endNode(r).token,
           amount: r.amount,
           method: r.method,
           timestamp: r.timestamp,
           hop: r.layer_hop
       }] as edges,
       length(path) as total_hops,
       reduce(s = 0, r in relationships(path) | s + r.amount) as total_path_amount
"""

CYPHER_LOUVAIN_COMMUNITIES = """
CALL gds.louvain.stream('muleGraph', {
    relationshipWeightProperty: 'amount',
    includeIntermediateCommunities: false
})
YIELD nodeId, communityId, intermediateCommunityIds
RETURN gds.util.asNode(nodeId).token AS account_token,
       gds.util.asNode(nodeId).bank AS bank,
       communityId AS syndicate_cluster_id
ORDER BY syndicate_cluster_id, account_token
"""

CYPHER_PAGERANK_CENTRALITY = """
CALL gds.pageRank.stream('muleGraph', {
    maxIterations: 20,
    dampingFactor: 0.85,
    relationshipWeightProperty: 'amount'
})
YIELD nodeId, score
RETURN gds.util.asNode(nodeId).token AS account_token,
       gds.util.asNode(nodeId).holder_name AS holder_name,
       gds.util.asNode(nodeId).bank AS bank,
       score AS hub_centrality_score
ORDER BY hub_centrality_score DESC
LIMIT $limit
"""

CYPHER_INSERT_TRANSACTION_EDGE = """
MERGE (sender:Account {token: $sender_token})
  ON CREATE SET sender.bank = $sender_bank, sender.ifsc = $sender_ifsc, sender.is_frozen = false
MERGE (receiver:Account {token: $receiver_token})
  ON CREATE SET receiver.bank = $receiver_bank, receiver.ifsc = $receiver_ifsc, receiver.is_frozen = false
CREATE (sender)-[r:TRANSFERRED_TO {
    txn_ref: $txn_ref,
    amount: $amount,
    method: $method,
    layer_hop: $layer_hop,
    timestamp: datetime($timestamp)
}]->(receiver)
RETURN r.txn_ref as created_ref
"""
