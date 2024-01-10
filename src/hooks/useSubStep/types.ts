import type {ComponentType} from 'react';

type SubStepProps = {
    /** value indicating whether user is editing one of the sub steps */
    isEditing: boolean;

    /** continues to next sub step */
    onNext: () => void;

    /** moves user to passed sub step */
    onMove: (step: number) => void;

    /** index of currently displayed sub step */
    screenIndex?: number;

    /** moves user to previous sub step */
    prevScreen?: () => void;
};

type UseSubStep<T = void> = {
    /** array of components that will become sub steps */
    bodyContent: Array<ComponentType<SubStepProps & T>>;

    /** called on last sub step  */
    onFinished: (data?: Record<string, unknown>) => void;

    /** index of initial sub step to display */
    startFrom?: number;
};

export type {SubStepProps, UseSubStep};
