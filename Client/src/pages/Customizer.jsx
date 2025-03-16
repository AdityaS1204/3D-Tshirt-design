import React, { useState, useEffect } from 'react'
import { AnimatePresence, motion, useDeprecatedAnimatedState } from 'framer-motion'
import { useSnapshot } from 'valtio'

import config from '../config/config';
import state from '../store';
import { download, logoShirt, stylishShirt } from '../assets';
import { downloadCanvasToImage, reader } from '../config/helpers';
import { EditorTabs, FilterTabs, DecalTypes } from '../config/constants';
import { fadeAnimation, slideAnimation } from '../config/motion';
import { ColorPicker, AIPicker, FilePicker, CustomButton, Tab } from '../components';
import { Result } from 'postcss';


const Customizer = () => {
  const snap = useSnapshot(state);
  const [file, setFile] = useState('')

  const [prompt, setPrompt] = useState('')
  const [generatingImg, setGeneratingImg] = useState(false);

  const [activeEditorTab, setActiveEditorTab] = useState("");
  const [activeFilterTab, setActiveFilterTab] = useState({
    logoShirt: true,
    stylishShirt: false,
  }

  );

  const generatingContent = () => {
    switch (activeEditorTab) {
      case "colorpicker":
        return <ColorPicker />
      case "filepicker":
        return <FilePicker
          file={file}
          setFile={setFile}
          readFile={readFile}
        />
      case "aipicker":
        return <AIPicker
        prompt={prompt}
        setPrompt={setPrompt}
        generatingImg={generatingImg}
        handleSubmit={handleSubmit}
        />

      default:
        return null;
    }
  }

const handleSubmit = async (type) => {
  if(!prompt) return alert("Please enter a prompt");
  try {
    setGeneratingImg(true);

    const response = await fetch('http://localhost:3000/api/v1/dalle', {
      method: 'POST',
      headers:{
        'Content-type': 'application/json'
      },
      body: JSON.stringify({
        prompt,
      })
    })
    const data = await response.json();
    handleDecals(type, data.photo)
  } catch (error) {
    alert(error);
  }finally{
    setGeneratingImg(false);
      setActiveEditorTab("");
  
  }
}

  const handleDecals = (type, result) => {
    const DecalType = DecalTypes[type];

    state[DecalType.stateProperty] = result;

    if (!activeFilterTab[DecalType.filtertab]) {
      handleActiveFilterTab(DecalType.filtertab)
    }
  }
  const handleActiveFilterTab = (tabName) => {
    switch (tabName) {
      case "logoShirt":
        state.isLogoTexture = !activeFilterTab[tabName];
        break;
      case "stylishShirt":
        state.isFullTexture = !activeFilterTab[tabName];
      default:
        state.isLogoTexture = true;
        state.isFullTexture = false;

    }
    setActiveFilterTab((prevstate) => { 
  return{
    ...prevstate,
    [tabName]: !prevstate[tabName]
  }
    })
  }


  const readFile = (type) => {
    reader(file)
      .then((result) => {
        handleDecals(type, result);
        setActiveEditorTab("");
      })
  }

  return (
    <AnimatePresence>
      {!snap.intro && (
        <>
          <motion.div
            key="custom"
            className='absolute top-0 left-0 z-10'
            {...slideAnimation('left')}
          >
            <div className="flex p-2 items-center min-h-screen">
              <div className="editortabs-contianer tabular-nums">
                {EditorTabs.map((tab) => (
                  <Tab
                    key={tab.name}
                    tab={tab}
                    handleClick={() => setActiveEditorTab(tab.name)}
                  />
                ))}
                {generatingContent()}
              </div>
            </div>
          </motion.div>
          <motion.div
            className='absolute top-5 right-5'
            {...fadeAnimation}
          >
            <CustomButton
              type="filled"
              title="Go back"
              customStyles="w-fit px-4 py-2.5 font-bold text-sm"
              handleClick={() => state.intro = true}
            />
          </motion.div>
          <motion.div className='filtertabs-container'
            {...slideAnimation('up')}
          >
            {FilterTabs.map((tab) => (
              <div >
                <Tab
                  key={tab.name}
                  tab={tab}
                  isFilterTab
                  isActivetab={activeFilterTab[tab.name]}
                  handleClick={() => handleActiveFilterTab(tab.name)}
                />
              </div>
            ))}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

export default Customizer