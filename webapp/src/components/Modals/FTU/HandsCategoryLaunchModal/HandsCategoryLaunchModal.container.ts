import { connect } from 'react-redux'
import { isLoadingFeatureFlags } from 'decentraland-dapps/dist/modules/features/selectors'
import { getIsHandsCategoryFTUEnabled } from '../../../../modules/features/selectors'
import { RootState } from '../../../../modules/reducer'
import { HandsCategoryLaunchModal } from './HandsCategoryLaunchModal'
import { MapStateProps } from './HandsCategoryLaunchModal.types'

const mapState = (state: RootState): MapStateProps => {
  return {
    isLoadingFeatureFlags: isLoadingFeatureFlags(state),
    isHandsCategoryFTUEnabled: getIsHandsCategoryFTUEnabled(state)
  }
}

export default connect(mapState, {})(HandsCategoryLaunchModal)
