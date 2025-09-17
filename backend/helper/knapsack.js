function knapsack(products, maxBudget) {
  const productCount = products.length;
  const dpTable = Array.from({ length: productCount + 1 }, () => Array(maxBudget + 1).fill(0));

  // Fill DP table with max scores
  for (let productIndex = 1; productIndex <= productCount; productIndex++) {
    const { price, score } = products[productIndex - 1];
    for (let currentBudget = 1; currentBudget <= maxBudget; currentBudget++) {
      if (price <= currentBudget) {
        dpTable[productIndex][currentBudget] = Math.max(
          dpTable[productIndex - 1][currentBudget], 
          dpTable[productIndex - 1][currentBudget - price] + score
        );
      } else {
        dpTable[productIndex][currentBudget] = dpTable[productIndex - 1][currentBudget];
      }
    }
  }

  // Backtrack to find chosen products
  let chosenProducts = [];
  let remainingBudget = maxBudget;
  for (let productIndex = productCount; productIndex > 0; productIndex--) {
    if (dpTable[productIndex][remainingBudget] !== dpTable[productIndex - 1][remainingBudget]) {
      chosenProducts.push(products[productIndex - 1]);
      remainingBudget -= products[productIndex - 1].price;
    }
  }

  return { bestScore: dpTable[productCount][maxBudget], bundle: chosenProducts };
}

module.exports = knapsack;
