import { http } from "../Http";

const ENDPOINT = "/api/v1/portfolio-templates";
const QUERY_ENDPOINT = "/api/v1/query";

const PortfolioTemplateService = {
  loadTemplates: () =>
    http.get(`${QUERY_ENDPOINT}/PortfolioTemplateEntity`, {
      params: { q: "description:%%", order: "description", pageSize: 1000 },
    }),
  save: (template) => http.post(ENDPOINT, template),
  loadAssets: (id) => http.get(`${ENDPOINT}/${id}/assets`),
  addAsset: (id, asset) => http.post(`${ENDPOINT}/${id}/assets`, asset),
  delete: (id, portfolioTemplateAssetId) =>
    http.delete(`${ENDPOINT}/${id}/assets/${portfolioTemplateAssetId}`),
};

export default PortfolioTemplateService;
