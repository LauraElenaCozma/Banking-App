
async function getMaxTransaction(user) {
    let maxSum = 0;
    const promotions = await user.getPromotions();

    promotions.forEach(promotion => {
        if (promotion.maxSumOfTransactions != null) {
            if (promotion.endDate == null && maxSum < promotion.maxSumOfTransactions) {
                maxSum = promotion.maxSumOfTransactions;
            }
            else {
                let endDate = new Date(promotion.endDate);
                let currentDate = new Date();
                if (endDate > currentDate && maxSum < promotion.maxSumOfTransactions) {
                    maxSum = promotion.maxSumOfTransactions;
                }
            }
        }
    });
    return maxSum;
}

module.exports = getMaxTransaction;