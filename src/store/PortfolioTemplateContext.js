import { createContext, useContext, useEffect, useReducer } from "react";
import PortfolioTemplateService from "../services/PortfolioTemplateService";

const PortfolioTemplateContext = createContext();

let initialState = {
    templates: [],
    currentTemplate: {},
    currentTemplateAssets: [],
    loading: true
}

let reducer = (state, { type, payload }) => {
    switch (type) {
        case "TEMPLATES_LOADED": return { ...state, loading: false, templates: payload };
        case "NEW_TEMPLATE_ADDED": return { ...state, loading: false, templates: [...state.templates, payload] };
        case "SET_CURRENT_TEMPLATE": return { ...state, loading: false, currentTemplate: payload };
        case "SET_CURRENT_TEMPLATE_ASSETS": return { ...state, loading: false, currentTemplateAssets: payload };
        case "NEW_TEMPLATE_ASSET_ADDED": return {
            ...state, loading: false, currentTemplateAssets: [
                ...state.currentTemplateAssets, payload]
        };
        default: return state;
    }
}

export const PortfolioTemplateContextProvider = ({ children }) => {
    const [state, dispatch] = useReducer(reducer, initialState);
    
    useEffect(() => {
        PortfolioTemplateService.loadTemplates()
            .then(({ data }) => dispatch({ type: "TEMPLATES_LOADED", payload: data.content }))
    }, []);
    return (<PortfolioTemplateContext.Provider
        value={[state, dispatch]}>
        {children}
    </PortfolioTemplateContext.Provider>)
}

export const usePortfolioTemplateContext = () => useContext(PortfolioTemplateContext);