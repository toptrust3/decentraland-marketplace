import { memo } from 'react'
import { t } from 'decentraland-dapps/dist/modules/translation/utils'
import { isNFT } from '../../../modules/asset/utils'
import Price from '../../Price'
import { ItemSaleActions } from './ItemSaleActions'
import { NFTSaleActions } from './NFTSaleActions'
import { Props } from './SaleActionBox.types'
import styles from './SaleActionBox.module.css'

const SaleActionBox = ({ asset }: Props) => {
  return isNFT(asset) || asset.isOnSale ? (
    <div className={styles.main}>
      <Price asset={asset} title={t('asset_page.sell_price')} />
      <div className={styles.container}>
        {isNFT(asset) ? (
          <NFTSaleActions nft={asset} />
        ) : (
          <ItemSaleActions item={asset} />
        )}
      </div>
    </div>
  ) : null
}

export default memo(SaleActionBox)
