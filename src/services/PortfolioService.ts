import { http } from "../Http";
import { IPortfolio } from "../types/portfolio";

const ENDPOINT = "/api/v1/portfolio";

export const PortfolioService = {
  getPortfolio: () => http.get<IPortfolio>(ENDPOINT),
};
