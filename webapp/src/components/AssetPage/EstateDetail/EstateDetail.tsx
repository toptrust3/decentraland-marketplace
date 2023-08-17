import React from 'react'
import classNames from 'classnames'
import { t } from 'decentraland-dapps/dist/modules/translation/utils'
import { Badge } from 'decentraland-ui'
import { isLand } from '../../../modules/nft/utils'
import { AssetImage } from '../../AssetImage'
import { Network } from '../../Network'
import Price from '../../Price'
import { Actions } from '../Actions'
import BaseDetail from '../BaseDetail'
import { BidList } from '../BidList'
import { Description } from '../Description'
import Expiration from '../Expiration'
import { JumpIn } from '../JumpIn'
import { Owner } from '../Owner'
import { ProximityHighlights } from '../ProximityHighlights'
import { RentalHistory } from '../RentalHistory'
import { SaleRentActionBox } from '../SaleRentActionBox'
import { TransactionHistory } from '../TransactionHistory'
import { ParcelCoordinates } from './ParcelCoordinates'
import { Props } from './EstateDetail.types'
import './EstateDetail.css'

const EstateDetail = ({ nft, order, rental }: Props) => {
  const estate = nft.data.estate!
  let x = 0
  let y = 0

  if (estate.size > 0) {
    x = estate.parcels[0].x
    y = estate.parcels[0].y
  }

  return (
    <BaseDetail
      className="EstateDetail"
      asset={nft}
      rental={rental ?? undefined}
      showDetails={isLand(nft)}
      assetImage={
        <>
          <AssetImage
            className={classNames(estate.size === 0 && 'dissolved')}
            asset={nft}
            isDraggable
            withNavigation
            hasPopup
          />
          {estate.size === 0 && (
            <div className="dissolved-wrapper">
              <div className="dissolved-notice">
                {t('estate_detail.dissolved')}
              </div>
            </div>
          )}
        </>
      }
      actions={<SaleRentActionBox order={order} nft={nft} rental={rental} />}
      isOnSale={!!nft.activeOrderId}
      badges={
        <>
          <Badge color="#37333d">{estate.size.toLocaleString()} LAND</Badge>
          {estate.size > 0 ? <JumpIn x={x} y={y} /> : null}
        </>
      }
      left={
        <>
          <Description text={estate.description} />
          <Owner asset={nft} />
          <ProximityHighlights nft={nft} />
        </>
      }
      box={
        <>
          <Price asset={nft} />
          <Network asset={nft} />
          {estate.size > 0 && <Actions nft={nft} />}
          <Expiration />
        </>
      }
      below={
        <>
          <BidList nft={nft} />
          {estate.size > 0 && <ParcelCoordinates estateId={nft.tokenId} />}
          <TransactionHistory asset={nft} />
          <RentalHistory asset={nft} />
        </>
      }
    />
  )
}

export default React.memo(EstateDetail)
