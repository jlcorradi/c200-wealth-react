import { http } from "../Http";

const ENDPOINT = "/api/v1/portfolio";

const PortfolioService = {
    getPortfolio: () => (http.get(ENDPOINT))
}

export default PortfolioService;