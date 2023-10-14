import Image from "next/image";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { faWallet } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export const ConnectBtn = () => {
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
                    className="leftsidebar_link bg-violet-800 hover:bg-violet-700 duration-200"
                    onClick={openConnectModal}
                    type="button"
                  >
                    <FontAwesomeIcon className="w-[20px] h-[20px] text-light-2" icon={faWallet} />
                    <p className="text-light-1 max-lg:hidden">Connect wallet</p>
                  </button>
                );
              }
              if (chain.unsupported) {
                return (
                  <button onClick={openChainModal} type="button">
                    Wrong network
                  </button>
                );
              }
              return (
                <div className="flex flex-col w-full gap-4">
                  <button
                    className="flex items-center gap-2 rounded-lg p-4 text-light-1 bg-zinc-800 hover:bg-zinc-700 duration-200"
                    onClick={openChainModal}
                    type="button"
                  >
                    {chain.hasIcon && (
                      <div className="w-[24px] h-[24px] rounded-full overflow-hidden">
                        {chain.iconUrl && (
                          <Image
                            className="w-[24px] h-[24px]"
                            src={chain.iconUrl}
                            alt={chain.name ?? "Chain icon"}
                            width={24}
                            height={24}
                          />
                        )}
                      </div>
                    )}
                    <span className="max-lg:hidden text-small-regular">{chain.name}</span>
                  </button>

                  <button
                    className="leftsidebar_link text-small-regular text-light-1 bg-zinc-800 hover:bg-zinc-700 duration-200 max-lg:hidden"
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
