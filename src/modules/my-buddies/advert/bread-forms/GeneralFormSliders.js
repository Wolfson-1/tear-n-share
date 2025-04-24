import React, { useEffect } from 'react'
import * as formHandlingUtils from '../../../../utils/formHandlingUtils';

export default function GeneralFormSliders({formData,setFormData}) {
  
  //arr auto filled in multiples of 5 up to 50 for use in max distance slider
  const distanceArr = Array.from(new Array(11).fill(0), (x,index) => x + (index * 5));


  return (
    <>
          <label>
          {`Max Distance (Miles)`}:
          <input type="range" step='0.5' min="0.5" max="50" value={formData.maxDistance} list='distanceValues' id='maxDistance' onChange={(e) => {
                                                                                                        formHandlingUtils.onChangeHandle(e,formData,setFormData);
                                                                                                      }}/>
          <datalist id="distanceValues">
              {distanceArr.map((dist)=>{
                return <option value={dist} label={dist}></option>
              })}
          </datalist>
          <span>{formData.maxDistance} Miles</span>
        </label>

        <label>
          {`Bread % & Cost Split (you want):`}
          <input type="range" step='25' min="25" max="75" value={formData.breadSplit} list='splitValues' id='breadSplit' onChange={(e) => {
                                                                                                        formHandlingUtils.onChangeHandle(e,formData,setFormData);
                                                                                                      }}/>
          <datalist id="splitValues">
              <option value='25' label='25%'></option>
              <option value='50' label='50%'></option>
              <option value='75' label='75%'></option>
          </datalist>
        </label>

        <label>
          How Often Needed per week:
          <input type="range" min="1" max="4" value={formData.breadFrequency} list='freqValues' id='breadFrequency' onChange={(e) => {
                                                                                                      formHandlingUtils.onChangeHandle(e,formData,setFormData);
                                                                                                      }}/>
          <datalist id="freqValues">
              <option value="1" label='1'></option>
              <option value="2" label='2'></option>
              <option value="3" label='3'></option>
              <option value="4" label='4'></option>
          </datalist>
        </label>

        <label>
          {`Max Total Price (£)`}
          <input type="range" step='0.05' min="0.00" max="5.00" value={formData.breadSpend} id='breadSpend' list='spendValues' onChange={(e) => {
                                                                                                      formHandlingUtils.onChangeHandle(e,formData,setFormData);
                                                                                                      }}/>
          <datalist id="spendValues">
              <option value="0" label='£0'></option>
              <option value="1" label='£1'></option>
              <option value="2" label='£2'></option>
              <option value="3" label='£3'></option>
              <option value="4" label='£4'></option>
              <option value="5" label='£5 +'></option>
          </datalist>
          <span>£{formData.breadSpend}</span>
    </label>
    </>
  )
}
