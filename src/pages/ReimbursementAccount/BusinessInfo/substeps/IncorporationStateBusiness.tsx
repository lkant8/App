import React from 'react';
import type {OnyxEntry} from 'react-native-onyx';
import {withOnyx} from 'react-native-onyx';
import FormProvider from '@components/Form/FormProvider';
import StatePicker from '@components/StatePicker';
import Text from '@components/Text';
import useLocalize from '@hooks/useLocalize';
import type {SubStepProps} from '@hooks/useSubStep/types';
import useThemeStyles from '@hooks/useThemeStyles';
import * as ValidationUtils from '@libs/ValidationUtils';
import getDefaultValueForReimbursementAccountField from '@pages/ReimbursementAccount/utils/getDefaultValueForReimbursementAccountField';
import CONST from '@src/CONST';
import ONYXKEYS from '@src/ONYXKEYS';
import type {ReimbursementAccount} from '@src/types/onyx';
import type {FormValues} from '@src/types/onyx/Form';
import type * as OnyxCommon from '@src/types/onyx/OnyxCommon';

type IncorporationStateBusinessOnyxProps = {
    /** Reimbursement account from ONYX */
    reimbursementAccount: OnyxEntry<ReimbursementAccount>;
};

type IncorporationStateBusinessProps = IncorporationStateBusinessOnyxProps & SubStepProps;

const companyIncorporationStateKey = CONST.BANK_ACCOUNT.BUSINESS_INFO_STEP.INPUT_KEY.INCORPORATION_STATE;

const validate = (values: FormValues): OnyxCommon.Errors => ValidationUtils.getFieldRequiredErrors(values, [companyIncorporationStateKey]);

function IncorporationStateBusiness({reimbursementAccount, onNext, isEditing}: IncorporationStateBusinessProps) {
    const {translate} = useLocalize();
    const styles = useThemeStyles();

    const defaultCompanyIncorporationState = getDefaultValueForReimbursementAccountField(reimbursementAccount, companyIncorporationStateKey, '');

    return (
        <FormProvider
            formID={ONYXKEYS.REIMBURSEMENT_ACCOUNT}
            submitButtonText={isEditing ? translate('common.confirm') : translate('common.next')}
            validate={validate}
            onSubmit={onNext}
            style={[styles.mh5, styles.flexGrow1]}
            submitButtonStyles={[styles.pb5, styles.mb0]}
        >
            <Text style={styles.textHeadline}>{translate('businessInfoStep.pleaseSelectTheStateYourCompanyWasIncorporatedIn')}</Text>
            <StatePicker
                // @ts-expect-error TODO: Remove this once StatePicker (https://github.com/Expensify/App/issues/25112) is migrated to TypeScript
                inputID={companyIncorporationStateKey}
                label={translate('businessInfoStep.incorporationState')}
                defaultValue={defaultCompanyIncorporationState}
                shouldSaveDraft
                wrapperStyle={[styles.ph0, styles.mt4]}
            />
        </FormProvider>
    );
}

IncorporationStateBusiness.displayName = 'IncorporationStateBusiness';

export default withOnyx<IncorporationStateBusinessProps, IncorporationStateBusinessOnyxProps>({
    reimbursementAccount: {
        key: ONYXKEYS.REIMBURSEMENT_ACCOUNT,
    },
})(IncorporationStateBusiness);
