import regression from 'regression'
import reducer from '../page/reducer'
import { setActiveBlockId, setActiveBlockContent } from '../page/actions'
import { SET_ACTIVE_BLOCK_CONTENT } from '../page/constants'
import {
  generateState,
  getBlockSize,
  SMALL,
  MED,
  LARGE,
} from './testStateBuildier'

const THRESHOLD = 1
const SAMPLE_SIZE = 20
const SLOPE_THRESHOLD = 0
const NS_PER_SEC = 1e9

function getAvg(threshold) {
  const total = threshold.reduce((acc, c) => acc + c, 0)
  return parseFloat(total / threshold.length)
}

describe('Performance Test', () => {
  describe(SET_ACTIVE_BLOCK_CONTENT, () => {
    const _size = [SMALL, MED, LARGE]
    const slopes = []
    const maxDeltas = []
    for (let i = 0; i < SAMPLE_SIZE; i += 1) {
      const deltas = []
      _size.forEach(size => {
        let _state = generateState(size)
        const _index = Math.floor(Math.random() * getBlockSize(size))
        const _id = _state.page.blocks[_index]._id
        const time = process.hrtime()
        _state = reducer(_state, setActiveBlockId(_id))
        _state = reducer(_state, setActiveBlockContent('updated content'))
        let diff = process.hrtime(time)
        diff = diff[0] * NS_PER_SEC + diff[1] / NS_PER_SEC
        deltas.push(diff)
        if (size === LARGE) {
          maxDeltas.push(diff)
        }
      })
      const points = deltas.map((d, j) => [getBlockSize(_size[j]), d])
      slopes.push(regression.linear(points).equation[0])
    }

    test('should test threshold for large sample size', () => {
      const _average = getAvg(maxDeltas)
      expect(Math.round(_average)).toBeLessThanOrEqual(THRESHOLD)
    })
    test('should have a slope threshold less than ', () => {
      const _average = getAvg(slopes)
      expect(_average).toBeLessThanOrEqual(SLOPE_THRESHOLD)
    })
  })
})
