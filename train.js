

const fs = require('fs');

// 入力読み込み
const input = fs.readFileSync('/dev/stdin', 'utf8');
const lines = input.trim().split('\n');

// グラフ構築
const graph = {};
const allNodes = new Set();

for (let line of lines) {
  const [fromRaw, toRaw, distRaw] = line.split(',').map(s => s.trim());
  const from = parseInt(fromRaw, 10);
  const to = parseInt(toRaw, 10);
  const dist = parseFloat(distRaw);

  if (!graph[from]) graph[from] = [];
  graph[from].push({ to, dist });

  allNodes.add(from);
  allNodes.add(to);
}

let maxDist = -Infinity;
let maxPath = [];

// DFS（始点への戻りだけ例外的に許可）
function dfs(current, visited, path, dist, start) {
  if (dist > maxDist) {
    maxDist = dist;
    maxPath = [...path];
  }

  if (!graph[current]) return;

  for (const edge of graph[current]) {
    const next = edge.to;
    const d = edge.dist;

    if (next === start && path.length > 1) {
      // 始点への戻り（閉路）を許可
      if (dist + d > maxDist) {
        maxDist = dist + d;
        maxPath = [...path, next];
      }
      continue;
    }

    if (!visited.has(next)) {
      visited.add(next);
      path.push(next);
      dfs(next, visited, path, dist + d, start);
      path.pop();
      visited.delete(next);
    }
  }
}

// 全ノードを始点にして探索
for (const start of allNodes) {
  const visited = new Set([start]);
  dfs(start, visited, [start], 0, start);
}

// 結果出力（\r\n区切り）
for (const node of maxPath) {
  process.stdout.write(node + '\r\n');
}
