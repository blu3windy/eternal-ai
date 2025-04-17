import { createSlice } from '@reduxjs/toolkit'
import { LayoutViewState } from './type'

const initialState: LayoutViewState = {
   isOpenAgentBar: true,
   isOpenRightBar: false,
   rightBarId: undefined,
}

const slice = createSlice({
   name: 'layoutView',
   initialState,
   reducers: {
      reset: (state: LayoutViewState) => {
         state.isOpenAgentBar = true;
         state.isOpenRightBar = false;
         state.rightBarView = undefined;
         state.rightBarId = undefined;
      },
      changeLayout: (state: LayoutViewState, action: { payload: { isOpenAgentBar: boolean, isOpenRightBar: boolean, rightBarView?: React.ReactNode, rightBarId?: string } }) => {
         state.isOpenAgentBar = action.payload.isOpenAgentBar
         state.isOpenRightBar = action.payload.isOpenRightBar
         state.rightBarView = action.payload.rightBarView
         state.rightBarId = action.payload.rightBarId
      },
   },
})

export const { reset, changeLayout } = slice.actions

export default slice.reducer
