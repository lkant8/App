import PropTypes from 'prop-types';
import React, {useCallback} from 'react';
import {View} from 'react-native';
import {withOnyx} from 'react-native-onyx';
import HeaderWithBackButton from '@components/HeaderWithBackButton';
import InteractiveStepSubHeader from '@components/InteractiveStepSubHeader';
import ScreenWrapper from '@components/ScreenWrapper';
import useLocalize from '@hooks/useLocalize';
import useSubStep from '@hooks/useSubStep';
import useThemeStyles from '@hooks/useThemeStyles';
import {reimbursementAccountPropTypes} from '@pages/ReimbursementAccount/reimbursementAccountPropTypes';
import * as ReimbursementAccountProps from '@pages/ReimbursementAccount/reimbursementAccountPropTypes';
import getDefaultValueForReimbursementAccountField from '@pages/ReimbursementAccount/utils/getDefaultValueForReimbursementAccountField';
import * as BankAccounts from '@userActions/BankAccounts';
import CONST from '@src/CONST';
import ONYXKEYS from '@src/ONYXKEYS';
import OnfidoInitialize from './substeps/OnfidoInitialize';

const propTypes = {
    /** Reimbursement account from ONYX */
    reimbursementAccount: reimbursementAccountPropTypes,

    /** Goes to the previous step */
    onBackButtonPress: PropTypes.func.isRequired,

    /** Exits flow and goes back to the workspace initial page */
    onCloseButtonPress: PropTypes.func.isRequired,

    onfidoApplicantID: PropTypes.string,
};

const defaultProps = {
    reimbursementAccount: ReimbursementAccountProps.reimbursementAccountDefaultProps,
    onfidoApplicantID: null,
};

const bodyContent = [OnfidoInitialize];

function VerifyIdentity({reimbursementAccount, onBackButtonPress, onCloseButtonPress, onfidoApplicantID}) {
    const styles = useThemeStyles();
    const {translate} = useLocalize();
    const submit = useCallback(
        (onfidoData) => {
            BankAccounts.verifyIdentityForBankAccount(getDefaultValueForReimbursementAccountField(reimbursementAccount, 'bankAccountID', 0), {...onfidoData, applicantID: onfidoApplicantID});
            BankAccounts.updateReimbursementAccountDraft({isOnfidoSetupComplete: true});
        },
        [reimbursementAccount, onfidoApplicantID],
    );

    const {componentToRender: SubStep, isEditing, nextScreen, moveTo} = useSubStep({bodyContent, startFrom: 0, onFinished: submit});

    return (
        <ScreenWrapper testID={VerifyIdentity.displayName}>
            <HeaderWithBackButton
                title={translate('onfidoStep.verifyIdentity')}
                onBackButtonPress={onBackButtonPress}
                onCloseButtonPress={onCloseButtonPress}
                shouldShowCloseButton
            />
            <View style={[styles.ph5, styles.mv3, {height: CONST.BANK_ACCOUNT.STEPS_HEADER_HEIGHT}]}>
                <InteractiveStepSubHeader
                    onStepSelected={() => {}}
                    startStepIndex={2}
                    stepNames={CONST.BANK_ACCOUNT.STEP_NAMES}
                />
            </View>
            <SubStep
                isEditing={isEditing}
                onNext={nextScreen}
                onMove={moveTo}
            />
        </ScreenWrapper>
    );
}

VerifyIdentity.propTypes = propTypes;
VerifyIdentity.defaultProps = defaultProps;
VerifyIdentity.displayName = 'VerifyIdentity';

export default withOnyx({
    reimbursementAccount: {
        key: ONYXKEYS.REIMBURSEMENT_ACCOUNT,
    },
    onfidoApplicantID: {
        key: ONYXKEYS.ONFIDO_APPLICANT_ID,
    },
})(VerifyIdentity);
