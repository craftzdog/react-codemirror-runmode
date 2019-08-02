import React from 'react'
import { mount } from 'enzyme'
import assert from 'assert'

import CodeMirror from 'codemirror'
import 'codemirror/addon/runmode/runmode'
import 'codemirror/mode/meta'
import 'codemirror/mode/javascript/javascript'
import Highlighter from '../lib/'

describe('highlight', () => {
  it('render code using CodeMirror', () => {
    const code = 'function blah(arg1) {};'
    const actual = (
      <Highlighter
        codeMirror={CodeMirror}
        value={code}
        theme="solarized"
        language="javascript"
      />
    )
    const wrapper = mount(actual)
    assert.ok(wrapper.find('pre').hasClass('cm-s-solarized'))
    assert.equal(wrapper.find('pre > code > span').length, 8)
    assert.ok(
      wrapper
        .find('pre > code > span')
        .first()
        .hasClass('cm-keyword')
    )
  })
})
