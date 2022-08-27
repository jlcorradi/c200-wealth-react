import React, {
  createContext,
  FC,
  PropsWithChildren,
  useContext,
  useEffect,
  useState,
} from "react";
import { Auth } from "../Auth";
import QueryService from "../services/QueryService";
import { NotificationEntity } from "../types/notification";

const useGlobal = () => {
  const [isLoading, setisLoading] = useState(false);
  const [isSidebarActive, setIsSidebarActive] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(Auth.isValidSession());
  const [notifications, setNotifications] = useState<NotificationEntity[]>([]);
  const [activeExpenseIncomeId, setactiveExpenseIncomeId] = useState<number>(0);
  const [globalOffcanvaVisible, setglobalOffcanvaVisible] = useState(false);
  const [globalOffsetTitle, setglobalOffsetTitle] = useState("");

  async function loadNotifications() {
    if (isAuthenticated) {
      const theNotifications = await QueryService.query<NotificationEntity>(
        "NotificationEntity",
        { read: false },
        "notificationDate(DESC)",
        0,
        100
      );
      setNotifications(theNotifications.data.content);
    }
  }

  useEffect(() => {
    loadNotifications();
  }, []);

  return {
    state: {
      isLoading,
      isSidebarActive,
      isAuthenticated,
      notifications,
      activeExpenseIncomeId,
      globalOffcanvaVisible,
      globalOffsetTitle,
    },
    actions: {
      toggleSidebarActive: function (value: boolean) {
        setIsSidebarActive(value);
      },
      toggleAuthenticated: function (value: boolean) {
        setIsAuthenticated(value);
      },
      loadNotifications,
      showExpenseIncomeOffset: function (expenseIncomeId: number) {
        setglobalOffcanvaVisible(expenseIncomeId > 0);
        setglobalOffsetTitle("Expense Income Details");
        setactiveExpenseIncomeId(expenseIncomeId);
      },
      dismissGlobalOffset: function () {
        setglobalOffcanvaVisible(false);
        setglobalOffsetTitle("");
      },
    },
  };
};

export type GlobalContextType = ReturnType<typeof useGlobal>;

const GlobalContext = createContext<GlobalContextType>(
  {} as unknown as GlobalContextType
);

export const GlobalStateProvider: FC<PropsWithChildren> = ({ children }) => {
  const ctx = useGlobal();
  return (
    <GlobalContext.Provider value={ctx}>{children}</GlobalContext.Provider>
  );
};

export const useGlobalState = () => useContext(GlobalContext);
