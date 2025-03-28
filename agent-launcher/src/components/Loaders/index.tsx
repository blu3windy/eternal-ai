import Spinner from "./Spinner";

type LoaderType = typeof Spinner & {
   Spinner: typeof Spinner;
};

const Loaders: any = Spinner;

Loaders.Spinner = Spinner;
export default Loaders as LoaderType;
