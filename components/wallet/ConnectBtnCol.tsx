import { ConnectButton } from "@rainbow-me/rainbowkit";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faWallet } from "@fortawesome/free-solid-svg-icons";
import { faFaceSadTear } from "@fortawesome/free-regular-svg-icons";

export const ConnectBtnCol = ({ signed }: { signed: boolean }) => {
  return (
    <ConnectButton.Custom>
      {({ account, chain, openAccountModal, openChainModal, openConnectModal, mounted }) => {
        const connected = mounted && account && chain && signed;

        return (
          <div
            {...(!mounted && {
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
                    className="rightsidebar_link bg-violet-300 hover:bg-violet-300/70 duration-200"
                    onClick={openConnectModal}
                    type="button"
                  >
                    <FontAwesomeIcon className="w-[20px] h-[20px] text-slate-500" icon={faWallet} />
                    <p className="text-dark-1 ">Connect wallet</p>
                  </button>
                );
              }
              if (chain.unsupported) {
                return (
                  <button
                    className="rightsidebar_link bg-violet-300 hover:bg-violet-300/70 duration-200"
                    onClick={openChainModal}
                    type="button"
                  >
                    <FontAwesomeIcon className="w-[20px] h-[20px] text-slate-500" icon={faFaceSadTear} />
                    <p className="text-dark-1 ">Unsupported network</p>
                  </button>
                );
              }
              return (
                <div className="flex flex-col w-full gap-4">
                  <button
                    className="flex items-center gap-2 rounded-lg p-4 text-dark-1 bg-violet-100 hover:bg-violet-200/70 duration-200"
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
                    <span className=" text-small-regular">{chain.name}</span>
                  </button>

                  <button
                    className="rightsidebar_link text-small-regular text-dark-1 bg-violet-100 hover:bg-violet-200/70 duration-200 "
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
