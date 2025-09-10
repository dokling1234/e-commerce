function knapsack(products, budget) {
  const n = products.length;
  const dp = Array.from({ length: n + 1 }, () => Array(budget + 1).fill(0));

  // Filll array table
  for (let i = 1; i <= n; i++) {
    const { price, score } = products[i - 1];
    for (let b = 1; b <= budget; b++) {
      if (price <= b) {
        dp[i][b] = Math.max(dp[i - 1][b], dp[i - 1][b - price] + score);
      } else {
        dp[i][b] = dp[i - 1][b];
      }
    }
  }

  // item backtracking
  let res = [];
  let b = budget;
  for (let i = n; i > 0; i--) {
    if (dp[i][b] !== dp[i - 1][b]) {
      res.push(products[i - 1]);
      b -= products[i - 1].price;
    }
  }

  return { bestScore: dp[n][budget], bundle: res };
}

module.exports = knapsack;
