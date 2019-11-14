class ClashPDF {

    constructor() {
    }



    async exportPDF(mc_containter_id, ms_id, ms_v_id, clashes) {

        try {
            var output = {}
            const msInfo = await global_msSet.getModelsetInfo(mc_containter_id, ms_id)
            output.createdTime = msInfo.createdTime
            output.description = msInfo.description
            output.name = msInfo.name
            const hub_id_without_b =  $('#hubs_list .active').attr('id');  
            const user_id =  msInfo.createdBy
            const userName = await global_dmProjects.getUserName('b.'+hub_id_without_b,user_id)
            output.createdBy = userName
 
             const msVInfo = await global_msSet.getModelsetVersionInfo(mc_containter_id, ms_id, ms_v_id)
            
            const clashInsJsonObj = global_clashRawView._clashInsJsonObj
            const clashJsonObj = global_clashRawView._clashJsonObj
            const matrixView = global_clashMatrixView._matrixView
            const clashDocIdToModel = global_forgeViewer._clashDocToModel
            const docsMap = global_msSet._docsMap

            //start a PDF doc
            var doc = new jsPDF('landscape','mm','A4') 

            //setting of the page. might be better to use some advanced libraries?
            var lineheight = 30
            const linespace = 10
            const indentSpace = 30
            const headerFontSize = 15
            const bodyFontSize = 16   

            //head logos
            await this.drawHeadLogo(doc)
            //head line
            this.drawHeadLine(doc)
            lineheight += linespace

            doc.setFont("helvetica");
            doc.setFontType("bold");
            doc.setTextColor(148, 114, 6);  
            doc.setFontSize(headerFontSize); 

            //build url of BIM 360 Modelset
            const msurl = 'https://model.b360.autodesk.com/projects/'
                          + global_msSet.mc_container_id 
                          + '/model-set/'
                          + global_msSet.ms_id
                          +'/clashes'
            //overview info in first page
            this.centeredText(doc,output.name + ' Clash Report',lineheight,msurl)
            doc.setTextColor(148, 114, 6);   
            lineheight += linespace
 
            doc.setFontType("normal");
            doc.setFontSize(bodyFontSize); 

            var colStyle = {
                0:{cellWidth: 50,fillColor: [220,220,220]},
                1:{cellWidth: 100} 
            }
            var rowStyle = {0:{minCellHeight: 25}} 

            var cols = ['','']
            var rows =  []
            rows.push(['Created Time',output.createdTime])
            rows.push(['Createted By',output.createdBy])
            rows.push(['Clashed Documents',docsMap.length]) 
            rows.push(['Total Clashes', clashJsonObj.clashes.length])
            rows.push(['Clashes in Report', clashes.length]) 
            rows.push(['Approval',''])

            this.drawTable(doc,indentSpace,lineheight,true,cols,rows,colStyle,rowStyle)

            lineheight += linespace*6 

            // doc.text('Documents: ', IndentSpace, lineheight)
            // lineheight += linespace  
            // for (let clashDocId in clashDocIdToModel) {
            //     doc.text(clashDocIdToModel[clashDocId].name, IndentSpace * 1.5, lineheight)
            //     lineheight += linespace
            // }  

            //doc.text('Matrix View by Object Count of Active Clash: ', IndentSpace, lineheight) 
            //lineheight += linespace
            this.drawTable(doc,indentSpace,lineheight,true,matrixView.cols,matrixView.rows)
 
             for (var index in clashes) {
                //next page 
                doc.addPage(); 

                lineheight = 30

                this.drawHeadLogo(doc) 
                this.drawHeadLine(doc)
                lineheight += linespace

                var eachItem = clashes[index];

                var Ldid = eachItem.Ldid
                var Rdid = eachItem.Rdid
                var Lvid = eachItem.Lvid
                var Rvid = eachItem.Rvid

                //breakdown view checks element of each model from the source raw clash instances data. 
                //source data only has one direction pair of data. e.g. 
                //ldid = modelA, rdid=modelB, lvid=modelA_elementA, rvid=modelB_elementB
                //while breakdown view clarifies as :
                // modelA_elementA: <elements in modelA which clash with this element>
                // modelB_elementB: <elements in modelB which clash with this element>
                // the Ldid,Rdid,Lvid,Rvid might be reversed agaist the source data
                // so, the filter will checks both possibilities.
                let filter = clashInsJsonObj.instances.filter(d=>{
                    return (d.ldid == Ldid && d.rdid == Rdid && d.lvid==Lvid&& d.rvid==Rvid)||
                            (d.ldid == Rdid && d.rdid == Ldid && d.lvid== Rvid && d.rvid==Lvid)
                })
                const cid = filter[0].cid
                filter = clashJsonObj.clashes.filter(d=>{
                    return d.id == cid
                })
                //get dist and status from 
                var dist = filter[0].dist
                var status = filter[0].status

                global_forgeViewer.isolateClash([{ Ldid: Ldid, Rdid: Rdid, Lvid: Lvid, Rvid: Rvid }])

                var bloburl = await this.getOneSnapshot()
                var blob = await this.getBlobFromUrl(bloburl)
                var image64based = await this.getBlobBase64(blob)

                doc.setFont("helvetica");
                doc.setFontType("bold");
                doc.setFontSize(bodyFontSize);
                lineheight += linespace
                doc.text('Clash:' + cid, indentSpace, lineheight)
                lineheight += linespace

                colStyle = {
                    0:{cellWidth: 50,fillColor: [220,220,220]},
                    1:{cellWidth: 80} 
                }
                rowStyle = {0:{minCellHeight: 25}} 

                cols = ['','']
                rows =  []
                rows.push(['Left Document',clashDocIdToModel[Ldid].name])
                rows.push(['Left Element Name',clashDocIdToModel[Ldid].model.getInstanceTree().getNodeName(Lvid)])
                rows.push(['Right Document',clashDocIdToModel[Rdid].name])
                rows.push(['Right Element Name',clashDocIdToModel[Rdid].model.getInstanceTree().getNodeName(Rvid)])
                rows.push(['Distance',dist])
                rows.push(['Status',status]) 
                rows.push(['Reviewer','']) 

                this.drawTable(doc,indentSpace,lineheight,'never',cols,rows,colStyle,rowStyle)
                
                //lineheight += linespace*6
                doc.addImage(image64based, 'PNG', indentSpace*5, lineheight, 100, 100)
             } 

            //save to a PDF
            doc.save(output.name + 'clash-report.pdf')
            global_Utility.successMessage('export PDF succeeded!')

            return true
        } catch (e) {
            console.log('export PDF failed:' + e)
            global_Utility.failMessage('export PDF failed')
            return false
        }
    } 

    async  getOneSnapshot() {
        return new Promise(function (resolve, reject) {
            global_forgeViewer._viewer.getScreenShot(500, 500,
                bloburl => {
                    resolve(bloburl)
                }
            )
        });
    }

    async getBlobBase64(blob) {
        return new Promise(function (resolve, reject) {
            var reader = new FileReader();
            reader.onload = function (event) {
                resolve(event.target.result);
            };
            reader.readAsDataURL(blob);
        });
    }
    async getBlobFromUrl(bloburl) {
        return new Promise(function (resolve, reject) {
            var xhr = new XMLHttpRequest;
            xhr.responseType = 'blob';
            xhr.onload = function () {
                var blob = xhr.response;
                resolve(blob)
            };
            xhr.open('GET', bloburl);
            xhr.send();
        });
    }


    centeredText = function(doc,text, y,url) {
        var textWidth = doc.getStringUnitWidth(text) * doc.internal.getFontSize() / doc.internal.scaleFactor;
        var textOffset = (doc.internal.pageSize.width - textWidth) / 2;
        doc.setTextColor(0, 0, 238); 
        doc.line(textOffset, y+2, textOffset + textWidth, y+2)
        if(url)
            doc.textWithLink(text, textOffset, y, { url: url }); 
        else
            doc.text(textOffset, y, text);
    }

    async drawHeadLogo(doc){
        var logo = await this.getBase64Image("./img/autodesk_text.png");   
        doc.addImage(logo, 'PNG', 10, 10, 50, 10); 
        logo = await this.getBase64Image("./img/autodesk-forge.png");  
        doc.addImage(logo, 'PNG', 270, 5, 15, 15); 
    }

    drawHeadLine(doc){
        const headlineSt = 10
        const headlineEnd = 280
        const headlineTop = 25
        doc.line(headlineSt, headlineTop, headlineEnd, headlineTop)
    }

    drawTable(doc,startX,startY,showHead,cols,rows,colStyle,rowStyle){
        doc.autoTable(cols, rows,
            {
                startX:startX,
                startY: startY,
                theme: 'grid', 
                tableWidth: 'wrap', 
                cellWidth: 'wrap', 
                showHead: showHead,
                width:50, 
                tableLineColor: 200, 
                tableLineWidth: 1, 
                styles: {overflow: 'linebreak', cellWidth: 'auto'}, 
                headStyles: {
                    theme: 'grid',

                },
                columnStyles:colStyle,
                rowStyles: rowStyle
            }
        )  
    }  
   //from https://jsfiddle.net/5tjov243/2/
    getBase64Image(url) {
        var promise = new Promise(function(resolve, reject) {
        
        var img = new Image();
        // To prevent: "Uncaught SecurityError: Failed to execute 'toDataURL' on 'HTMLCanvasElement': Tainted canvases may not be exported."
        img.crossOrigin = "Anonymous"; 
        img.onload = function() {
            var canvas = document.createElement("canvas");
            canvas.width = img.width;
            canvas.height = img.height;
            var ctx = canvas.getContext("2d");
            ctx.drawImage(img, 0, 0);
            var dataURL = canvas.toDataURL("image/png");
            resolve(dataURL);
        };  
        img.src = url;      
        }); 
        return promise;
    }
 
 
}
