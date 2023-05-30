import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { t } from 'decentraland-dapps/dist/modules/translation/utils'
import { Order, OrderFilters, OrderSortBy } from '@dcl/schemas'
import { Button, Loader } from 'decentraland-ui'
import Mana from '../../Mana/Mana'
import { formatDistanceToNow } from '../../../lib/date'
import clock from '../../../images/clock.png'
import makeOffer from '../../../images/makeOffer.png'
import { locations } from '../../../modules/routing/locations'
import { bidAPI, orderAPI } from '../../../modules/vendor/decentraland'
import { AssetType } from '../../../modules/asset/types'
import { ManaToFiat } from '../../ManaToFiat'
import { formatWeiToAssetCard } from '../../AssetCard/utils'
import { BuyNFTButtons } from '../SaleActionBox/BuyNFTButtons'
import { Props } from './BuyNFTBox.types'
import styles from './BuyNFTBox.module.css'

const FIRST = '1'

const BuyNFTBox = ({ nft, address }: Props) => {
  const [isLoading, setIsLoading] = useState(false)
  const [listing, setListing] = useState<{
    order: Order
    total: number
  } | null>(null)

  const [canBid, setCanBid] = useState(false)
  const isOwner = nft && nft?.owner === address

  useEffect(() => {
    if (!isOwner && nft) {
      bidAPI
        .fetchByNFT(
          nft.contractAddress,
          nft.tokenId,
          null,
          undefined,
          FIRST,
          undefined,
          address
        )
        .then(response => {
          if (response.total === 0) setCanBid(true)
        })
        .catch(error => {
          console.error(error)
        })
    }
  }, [nft, address, isOwner])

  useEffect(() => {
    if (nft) {
      setIsLoading(true)

      let params: OrderFilters = {
        contractAddress: nft.contractAddress,
        first: 1,
        skip: 0,
        tokenId: nft.tokenId
      }

      orderAPI
        .fetchOrders(params, OrderSortBy.CHEAPEST)
        .then(response => {
          if (response.data.length > 0) {
            setListing({ order: response.data[0], total: response.total })
          }
        })
        .finally(() => setIsLoading(false))
        .catch(error => {
          console.error(error)
        })
    }
  }, [nft])

  return (
    <div className={styles.BuyNFTBox}>
      {isLoading ? (
        <div className={styles.emptyContainer}>
          <Loader active data-testid="loader" />
        </div>
      ) : nft && listing ? (
        <div className={`${styles.containerColumn} ${styles.fullWidth}`}>
          <div className={styles.informationContainer}>
            <div className={styles.columnListing}>
              <span className={styles.informationTitle}>
                {t('best_buying_option.minting.price').toUpperCase()}
              </span>
              <div className={`${styles.containerRow} ${styles.centerItems}`}>
                <div className={styles.informationBold}>
                  <Mana
                    withTooltip
                    size="large"
                    network={nft.network}
                    className={styles.informationBold}
                  >
                    {formatWeiToAssetCard(listing.order.price)}
                  </Mana>
                </div>
                {+listing.order.price > 0 && (
                  <div className={styles.informationText}>
                    {'('}
                    <ManaToFiat mana={listing.order.price} />
                    {')'}
                  </div>
                )}
              </div>
            </div>

            <div className={styles.columnListing}>
              <span className={styles.informationTitle}>
                {t('best_buying_option.buy_listing.issue_number').toUpperCase()}
              </span>
              <div className={`${styles.containerRow} ${styles.issueNumber}`}>
                #{listing.order.issuedId}
              </div>
            </div>
          </div>
          {isOwner ? (
            listing ? (
              <>
                <Button
                  as={Link}
                  to={locations.sell(nft.contractAddress, nft.tokenId)}
                  primary
                  fluid
                >
                  {t('asset_page.actions.update')}
                </Button>
                <Button
                  as={Link}
                  to={locations.cancel(nft.contractAddress, nft.tokenId)}
                  fluid
                  inverted
                >
                  {t('asset_page.actions.cancel_sale')}
                </Button>
              </>
            ) : (
              <Button
                as={Link}
                to={locations.sell(nft.contractAddress, nft.tokenId)}
                primary
                fluid
              >
                {t('asset_page.actions.sell')}
              </Button>
            )
          ) : (
            <BuyNFTButtons
              assetType={AssetType.NFT}
              contractAddress={nft.contractAddress}
              network={nft.network}
              tokenId={nft.tokenId}
              buyWithCardClassName={styles.buyWithCardClassName}
            />
          )}
          {canBid && (
            <Button
              inverted
              className={styles.makeOfferButton}
              as={Link}
              to={locations.bid(nft.contractAddress, nft.tokenId)}
            >
              <img
                src={makeOffer}
                alt={t('best_buying_option.buy_listing.make_offer')}
              />
              &nbsp;
              {t('best_buying_option.buy_listing.make_offer')}
            </Button>
          )}
          <span className={styles.expiresAt}>
            <img src={clock} alt="clock" className={styles.mintingIcon} />
            &nbsp;
            {t('best_buying_option.buy_listing.expires')}&nbsp;
            {formatDistanceToNow(listing.order.expiresAt, {
              addSuffix: true
            })}
            .
          </span>
        </div>
      ) : (
        nft && (
          <div className={`${styles.containerColumn} ${styles.fullWidth}`}>
            <div className={styles.informationContainer}>
              <div className={styles.columnListing}>
                <span className={styles.informationTitle}>
                  {t('best_buying_option.minting.price').toUpperCase()}
                </span>
                <div className={`${styles.containerRow} ${styles.issueNumber}`}>
                  {t('best_buying_option.buy_listing.no_offer')}
                </div>
              </div>
              <div className={styles.columnListing}>
                <span className={styles.informationTitle}>
                  {t('best_buying_option.buy_listing.make_offer').toUpperCase()}
                </span>
                <div className={`${styles.containerRow} ${styles.issueNumber}`}>
                  #{nft.issuedId}
                </div>
              </div>
            </div>
            <Button
              inverted
              className={styles.makeOfferButton}
              as={Link}
              to={locations.bid(nft.contractAddress, nft.tokenId)}
            >
              <img
                src={makeOffer}
                alt={t('best_buying_option.buy_listing.make_offer')}
              />
              &nbsp;
              {t('best_buying_option.buy_listing.make_offer')}
            </Button>
          </div>
        )
      )}
    </div>
  )
}

export default React.memo(BuyNFTBox)
