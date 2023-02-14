import { createContext, useContext } from "react";
export type GlobalContent = {
  loading: boolean;
  setLoading: (c: boolean) => void;
};
export const MyGlobalContext = createContext<GlobalContent>({
  loading: false,
  setLoading: () => {},
});
export const useGlobalContext = () => {
  const { loading, setLoading } = useContext(MyGlobalContext);
  return { loading, setLoading };
};
