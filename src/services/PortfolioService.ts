import { http } from "../Http";
import { IPortfolio } from "../types/portfolio";

const ENDPOINT = "/api/v1/portfolio";

const PortfolioService = {
  getPortfolio: () => http.get<IPortfolio>(ENDPOINT),
};

export default PortfolioService;
