import { http } from "../Http"

const ENDPOINT = "/api/v1/bank_accounts"

const BankAccountService = {
    getInvestmentAccounts: () => {
        return http.get(`${ENDPOINT}?type=INVESTMENT`)
    },
    getCheckingAccounts: () => {
        return http.get(`${ENDPOINT}?type=CHECKING`)
    },
    list: () => {
        return http.get(`${ENDPOINT}`)
    },
    setDefaultPaier: (id) => (http.put(`${ENDPOINT}/${id}/default_payment_account`))
}

export default BankAccountService;