interface BaseState {
  success: boolean
  message?: string
}

interface SuccessActionState extends BaseState {
  success: true
}

interface SuccessCreateState<T> extends SuccessActionState {
  id: T
}

interface FailureActionState extends BaseState {
  success: false
  error: Error
}

export type ActionState = SuccessActionState | FailureActionState
export type CreateState<T> = SuccessCreateState<T> | FailureActionState

interface SuccessDataState<T> extends BaseState {
  success: true
  data: T
}

interface FailureDataState extends BaseState {
  success: false
  error: Error
}

export type DataState<T> = SuccessDataState<T> | FailureDataState

export type ActionResult = Promise<ActionState>
export type CreateResult<T> = Promise<CreateState<T>>
export type DataResult<T> = Promise<DataState<T>>
