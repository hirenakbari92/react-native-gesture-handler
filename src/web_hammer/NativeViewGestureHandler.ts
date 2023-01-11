import DiscreteGestureHandler from './DiscreteGestureHandler';
import { HammerInputExt } from './GestureHandler';
import * as NodeManager from './NodeManager';
import PressGestureHandler from './PressGestureHandler';
import { TEST_MIN_IF_NOT_NAN, VEC_LEN_SQ } from './utils';

class NativeViewGestureHandler extends PressGestureHandler {
  get isNative() {
    return true;
  }

  onRawEvent(ev: HammerInputExt) {
    super.onRawEvent(ev);
    console.log("rmv-NativeViewGestureHandler-14",ev)
    if (!ev.isFinal) {
      // if (this.ref instanceof ScrollView) {
      if (TEST_MIN_IF_NOT_NAN(VEC_LEN_SQ({ x: ev.deltaX, y: ev.deltaY }), 10)) {
        // @ts-ignore FIXME(TS) config type
        if (this.config.disallowInterruption) {
          const gestures = Object.values(NodeManager.getNodes()).filter(
            (gesture) => {
              const { handlerTag, view, isGestureRunning } = gesture;
              console.log("rmv-NativeViewGestureHandler-23",handlerTag !== this.handlerTag && isGestureRunning && gesture instanceof DiscreteGestureHandler && view)
              return (
                // Check if this gesture isn't self
                handlerTag !== this.handlerTag &&
                // Ensure the gesture needs to be cancelled
                isGestureRunning &&
                // ScrollView can cancel discrete gestures like taps and presses
                gesture instanceof DiscreteGestureHandler &&
                // Ensure a view exists and is a child of the current view
                view &&
                // @ts-ignore FIXME(TS) view type
                this.view.contains(view)
              );
            }
          );
          // Cancel all of the gestures that passed the filter
          for (const gesture of gestures) {
            // TODO: Bacon: Send some cached event.
            gesture.forceInvalidate(ev);
          }
        } else {
          console.log("rmv-NativeViewGestureHandler-43",this)
        }
      }
    }
    else {
      console.log("rmv-NativeViewGestureHandler-48",ev)
    }
  }
}

export default NativeViewGestureHandler;
