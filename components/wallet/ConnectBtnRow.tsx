import { ConnectButton } from "@rainbow-me/rainbowkit";
import { faWallet } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export const ConnectBtnRow = () => {
  return (
    <ConnectButton.Custom>
      {({ account, chain, openAccountModal, openChainModal, openConnectModal, authenticationStatus, mounted }) => {
        // Note: If your app doesn't use authentication, you
        // can remove all 'authenticationStatus' checks
        const ready = mounted && authenticationStatus !== "loading";
        const connected =
          ready && account && chain && (!authenticationStatus || authenticationStatus === "authenticated");

        return (
          <div
            {...(!ready && {
              "aria-hidden": true,
              style: {
                opacity: 0,
                pointerEvents: "none",
                userSelect: "none",
              },
            })}
          >
            {(() => {
              if (!connected) {
                return (
                  <button
                    className="flex items-center gap-2 rounded-lg px-4 bg-violet-200 hover:bg-violet-200/70 duration-200 h-[42px] max-sm:hidden"
                    onClick={openConnectModal}
                    type="button"
                  >
                    <FontAwesomeIcon className="w-[16px] h-[16px] text-slate-500" icon={faWallet} />
                    <p className="text-dark-1 max-sm:hidden">Connect wallet</p>
                  </button>
                );
              }
              if (chain.unsupported) {
                return (
                  <button onClick={openChainModal} type="button">
                    Unsupported network
                  </button>
                );
              }
              return (
                <div className="flex w-full text-small-regular gap-2 h-[42px] max-sm:hidden">
                  <button
                    className="flex justify-center items-center gap-2 rounded-lg px-2 text-dark-1 bg-violet-100 hover:bg-violet-200/70 duration-200"
                    onClick={openChainModal}
                    type="button"
                  >
                    {chain.hasIcon && (
                      <div className="w-[24px] h-[24px] rounded-full overflow-hidden">
                        {chain.iconUrl && (
                          <img className="w-[24px] h-[24px]" src={chain.iconUrl} alt={chain.name ?? "Chain icon"} />
                        )}
                      </div>
                    )}
                    <span>{chain.name}</span>
                  </button>

                  <button
                    className="text-dark-1 bg-violet-100 hover:bg-violet-200/70 duration-200 rounded-lg px-2"
                    onClick={openAccountModal}
                    type="button"
                  >
                    {account.displayName}
                    {account.displayBalance ? ` (${account.displayBalance})` : ""}
                  </button>
                </div>
              );
            })()}
          </div>
        );
      }}
    </ConnectButton.Custom>
  );
};
