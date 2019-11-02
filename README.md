# BIM 360 Model Coorrdination API Sample - PDF Exporter of Clash 

[![node](https://img.shields.io/badge/nodejs-6.11.1-yellow.svg)](https://nodejs.org)
[![npm](https://img.shields.io/badge/npm-3.10.10-green.svg)](https://www.npmjs.com/)
[![visual code](https://img.shields.io/badge/visual%20code-1.28.2-orange.svg)](https://code.visualstudio.com)

[![oAuth2](https://img.shields.io/badge/oAuth2-v1-green.svg)](https://forge.autodesk.com/en/docs/oauth/v2/overview/)
[![Data-Management](https://img.shields.io/badge/Data%20Management-v1-green.svg)](https://forge.autodesk.com/en/docs/data/v2/developers_guide/overview/)
[![Viewer](https://img.shields.io/badge/Viewer-v7-green.svg)](https://forge.autodesk.com/en/docs/viewer/v7/developers_guide/overview/)
[![BIM-360](https://img.shields.io/badge/BIM%20360-v1-green.svg)](https://forge.autodesk.com/en/docs/bim360/v1/overview/introduction/) 

[![ModelSetAPI](https://img.shields.io/badge/ModelSetAPI-3.0.51-lightgrey)]()
[![ClashAPI](https://img.shields.io/badge/ClashAPI-3.3.17-yellowgreen)]()
[![IndexAPI](https://img.shields.io/badge/IndexAPI-1.2.32-orange)]()

[![License](http://img.shields.io/:license-mit-red.svg)](http://opensource.org/licenses/MIT)
[![Level](https://img.shields.io/badge/Level-Intermediate-blue.svg)](http://developer.autodesk.com/)


## Description
This repository demonstrates advanced viewing of clash raw data by Model Coordination API and demos exporting a PDF reports on the clashes the user is interested in. 
 
## Thumbnail

<p align="center"><img src="./help/main.png" width="1000"></p>
<p align="center"><img src="./help/pdf.png" width="1000"></p>

## Live version
(TO Deploy)

## Demonstrations

1. After loging in, on top left of navigation panel, select one hub, then select one project. 
2. After selecting one projet, the active modelsets in this activeproject will be listed.
3. Click one modelset, all documents in the modelset will be grouped in the dropdown list of **Clash Breakdown by Element** . All documents of this modelset will also be loaded in Forge viewer
4. After all documents are loaded in Forge Viewer, select one document from dropdown list, the clashes by document elements will be listed. Select one clash or group of clashes, the corresponding clashes will be highlighted in Forge viewer. 
5. Tick some clashes, click **Export PDF**. After a while, a report will be generated. It contains overview of the modelset and information of each clash, including a screenshot. Note: do not touch Forge Viewer while exporting is running because the code will take snapshot of each clash.
 
Watch [this video](https://youtu.be/eb-yXJ9LjIw) on how to play this demo.

## Technology Architecture

The sample firstly downloads the model set data and clash data of the selected project. 

 <p align="center"><img src="./help/workflow.png" width="600"></p>  

The relationship of the data are clash mapping, please refer to the other sample [Clash View Basic](https://github.com/xiaodongliang/bim360-mcapi-node-clashview-basic.sample) 

Based on the relationship, the code analyzes the data to build the mapping among clash document, version URN and viewerable guid etc. The mapping is saved to **docsMap.json**

 <p align="center"><img src="./help/docmap.png" width="400"></p>   

The method [getBreakdownData](./server/analyze.js) iterates each clash instances. For one element (lvid) of one clash, the method dumps all clashes that this element (lvid) is involved, and groups them in document.

 <p align="center"><img src="./help/breakdown.png" width="800"></p>  


# Setup

## Prerequisites
1. **BIM 360 Account**: must be Account Admin to add the app integration, or invited by admin of BIM admin. [Learn about provisioning](https://forge.autodesk.com/blog/bim-360-docs-provisioning-forge-apps). 
2. **Forge Account**: Learn how to create a Forge Account, activate subscription and create an app at [this tutorial](http://learnforge.autodesk.io/#/account/). Get _Forge client id_, _Forge client secret_ and _Forge callback url_ and input them to [config.js](./server/config.js)
3. Create some [modelsets of Model Coordination](https://knowledge.autodesk.com/support/bim-360/learn-explore/caas/CloudHelp/cloudhelp/ENU/BIM360D-Model-Coordination/files/GUID-38CC3A1C-92FF-4682-847F-9CFAFCC4CCCE-html.html) in BIM 360. 
4. **Node.js**: basic knowledge with [**Node.js**](https://nodejs.org/en/).
5. **JavaScript** basic knowledge with **jQuery** and **Bootstrap**

## Running locally
Clone this project or download it. It's recommended to install [GitHub desktop](https://desktop.github.com/). To clone it via command line, use the following (**Terminal** on MacOSX/Linux, **Git Shell** on Windows):

    git clone https://github.com/xiaodongliang/bim360-mcapi-node-pdf.exporter.sample

Open the project folder in **Visual Studio Code**. Install the required packages, set the environment variables with your client ID & secret and finally start it. Via command line, navigate to the folder where this repository was cloned and use the following:

    npm install 
    node start.js

Open the browser: [http://localhost:3000](http://localhost:3000).  

## Deployment

To deploy this application to Heroku, the **Callback URL** for Forge must use your `.herokuapp.com` address. After clicking on the button below, at the Heroku Create New App page, set your Client ID, Secret and Callback URL for Forge.

[![Deploy](https://www.herokucdn.com/deploy/button.svg)](https://heroku.com/deploy?template=https://github.com/xiaodongliang/bim360-node.js-issues.api)

Watch [this video](https://www.youtube.com/watch?v=Oqa9O20Gj0c) on how deploy samples to Heroku.
 

# Further Reading
- [Model Coordination API](https://dev.forge.autodesk.com/en/docs/bim360/v1/tutorials/model-coordination/?sha=6092_51)  
- [BIM 360 API](https://developer.autodesk.com/en/docs/bim360/v1/overview/) and [App Provisioning](https://forge.autodesk.com/blog/bim-360-docs-provisioning-forge-apps)
- [Data Management API](https://developer.autodesk.com/en/docs/data/v2/overview/)
- [Viewer](https://developer.autodesk.com/en/docs/viewer/v7)
 

Tutorials:

- [Model Coordination API Document](https://dev.forge.autodesk.com/en/docs/bim360/v1/tutorials/model-coordination/mc-concept-modelset/?sha=6092_51) 
- [View BIM 360 Models](http://learnforge.autodesk.io/#/tutorials/viewhubmodels)

Blogs:

- [Forge Blog](https://forge.autodesk.com/categories/bim-360-api)
- [Field of View](https://fieldofviewblog.wordpress.com/), a BIM focused blog

### Tips & Tricks

-  Since the clash data might be large, don't pull the file locally and then process it. Decompressing and streaming the results on the fly would also be recommended, as showned in this sample [utility.js](./server/utility.js) 
- To make a simple demo, this sample does not use database to manage the clash data. 
- On client (browser) side, it may be more efficient to manage the data by IndexDB if the app requires to perform various analysis in different browser sessions.
- Do not touch Forge Viewer while exporting PDF is running because the code will take snapshot of each clash.


### Troubleshooting

-  **Cannot see my BIM 360 projects**: Make sure to provision the Forge App Client ID within the BIM 360 Account, [learn more here](https://forge.autodesk.com/blog/bim-360-docs-provisioning-forge-apps). This requires the Account Admin permission.

- The code of highlighting objects within Forge Viewer requires the corresponding documents of one clash instance have been loaded. If not, the highlighting will not work, try again when the loading is completed
 
## License

This sample is licensed under the terms of the [MIT License](http://opensource.org/licenses/MIT). Please see the [LICENSE](LICENSE) file for full details.

## Written by

Xiaodong Liang [@coldwood](https://twitter.com/coldwood), [Forge Partner Development](http://forge.autodesk.com)
