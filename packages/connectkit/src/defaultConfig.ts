import { ConfigOptions, xrplMainnet } from "@hypergate/core";

// TODO: Move these to a provider rather than global variable
let globalAppName: string;
let globalAppIcon: string;
export const getAppName = () => globalAppName;
export const getAppIcon = () => globalAppIcon;

type DefaultConfigProps = {
  appName: string;
  appIcon?: string;
  appDescription?: string;
  appUrl?: string;
} & ConfigOptions;

const defaultConfig = ({
  appName = "ConnectKit",
  appIcon,
  appDescription,
  appUrl,
  chains = [xrplMainnet],
  client,
  ...props
}: DefaultConfigProps): ConfigOptions => {
  globalAppName = appName;
  if (appIcon) globalAppIcon = appIcon;

  const connectors: ConfigOptions["connectors"] = props?.connectors ?? [];

  const config: ConfigOptions = {
    ...props,
    chains,
    connectors,
  };

  return config;
};

export default defaultConfig;
