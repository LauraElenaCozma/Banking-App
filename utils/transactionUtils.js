
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

async function getMaxNoAccounts(user) {
    let maxNo = 0;
    const promotions = await user.getPromotions();
    promotions.forEach(promotion => {
        if (promotions.maxNoOfAccounts != null) { //promotion that affects the number of accounts
            if (promotion.endDate == null && maxNo < promotion.maxNoOfAccounts) {
                maxNo = promotion.maxNoOfAccounts;
            }
            else {
                let endDate = new Date(promotion.endDate);
                let currentDate = new Date();
                if (endDate > currentDate && maxNo < promotion.maxNoOfAccounts) {
                    maxNo = promotion.maxNoOfAccounts;
                }
            }
        }
    });
    return maxNo;
}

module.exports = {getMaxTransaction, getMaxNoAccounts};