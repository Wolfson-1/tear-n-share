import React, { useState } from 'react'

export default function GeneralFormSliders() {

  // state for slider inputs
  const [breadSplit,setBreadSplit] = useState(50);
  const [breadFrequency,setBreadFrequency] = useState(1);
  const [breadSpend,setBreadSpend] = useState(0);

  return (
    <>
    <label>
        Bread Split %
        <input type="range" step='25' min="25" max="75" value={breadSplit} list='splitValues' onChange={(e) => {
                                                                                                    setBreadSplit(e.target.value)
                                                                                                    }}/>
        <datalist id="splitValues">
            <option value='25' label='25%'></option>
            <option value='50' label='50%'></option>
            <option value='75' label='75%'></option>
        </datalist>
        </label>

        <label>
        How Often Needed per week
        <input type="range" min="1" max="4" value={breadFrequency} list='freqValues' onChange={(e) => {
                                                                                                    setBreadFrequency(e.target.value)
                                                                                                    }}/>
        <datalist id="freqValues">
            <option value="1" label='1'></option>
            <option value="2" label='2'></option>
            <option value="3" label='3'></option>
            <option value="4" label='4'></option>
        </datalist>
        </label>

        <label>
        Max Price £
        <input type="range" step='0.05' min="0.00" max="5.00" value={breadSpend} list='spendValues' onChange={(e) => {
                                                                                                    setBreadSpend(e.target.value)
                                                                                                    }}/>
        <datalist id="spendValues">
            <option value="0" label='£0'></option>
            <option value="1" label='£1'></option>
            <option value="2" label='£2'></option>
            <option value="3" label='£3'></option>
            <option value="4" label='£4'></option>
            <option value="5" label='£5 +'></option>
        </datalist>
        <span>£{breadSpend}</span>
    </label>
    </>
  )
}
