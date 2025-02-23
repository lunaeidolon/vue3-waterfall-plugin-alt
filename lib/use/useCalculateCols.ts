/*
 * @Author: Yaowen Liu
 * @Date: 2022-03-08 14:59:00
 * @LastEditors: Yaowen Liu
 * @LastEditTime: 2022-03-24 11:01:51
 */
import { computed, ref } from "vue"
import { useResizeObserver } from "@vueuse/core"
import { getItemWidth } from "../utils/itemWidth"
import type { WaterfallProps } from "../types/waterfall"
import type { Nullable } from "../types/util"

export function useCalculateCols(props: WaterfallProps) {
  const wrapperWidth = ref<number>(0)
  const waterfallWrapper = ref<Nullable<HTMLElement>>(null)

  useResizeObserver(waterfallWrapper, (entries) => {
    const entry = entries[0]
    const { width } = entry.contentRect
    wrapperWidth.value = width
  })

  // 列实际宽度
  const colWidth = computed(() => {
    return getItemWidth({
      wrapperWidth: wrapperWidth.value,
      breakpoints: props.breakpoints,
      gutter: props.gutter,
      gutterRow: props.gutterRow,
      hasAroundGutter: props.hasAroundGutter,
      initWidth: props.width,
    })
  })

  // 列
  const cols = computed(() => {
    const offset = props.hasAroundGutter ? -props.gutter : props.gutter
    return Math.floor(
      (wrapperWidth.value + offset) / (colWidth.value + props.gutter),
    )
  })

  // 偏移
  const offsetX = computed(() => {
    const offset = props.hasAroundGutter ? props.gutter : -props.gutter
    const contextWidth = cols.value * (colWidth.value + props.gutter) + offset
    return (wrapperWidth.value - contextWidth) / 2
  })

  return {
    waterfallWrapper,
    wrapperWidth,
    colWidth,
    cols,
    offsetX,
  }
}
