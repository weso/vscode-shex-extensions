var yate = YATE(document.getElementById('yateContainer'));
var yashe = YASHE(document.getElementById('yasheContainer'));
var yasme = YASME(document.getElementById('yasmeContainer'));


yate.setSize(null,550);
yashe.setSize(null,550);
yasme.setSize(null,100);





function updateTable(){

        $('#validateTable').remove();
        $('#validateZone').append(
            $('<div class="table-responsive">'+
                '<table id="validateTable" class="table table-striped">'+ 
                '<thead id="thead" class="thead-dark">'+ 
                    '<tr>'+ 
                    '<th scope="col">Id</th>'+ 
                    '<th scope="col">Node</th>'+ 
                    '<th scope="col">Shape</th>'+ 
                    '<th scope="col">Details</th>'+ 
                    '</tr>'+ 
                '</thead>'+ 
                '<tbody id="tBody"/>'+
                '</table>'+
            '<div>'));

            let obj = 

             [
                 {
                     node:'<jhon>',
                     shape:'<Person>',
                     details:'conformant'
                 },
                 {
                     node:'<Pluto>',
                     shape:'<Person>',
                     details:'nonconformant'
                 }
             ];
            

            for(let i in obj){
                console.log(obj[i])
                let succces = 'table-success';
                let id = $('<td>').text("0");
                let node = $('<td>').text(obj[i].node);
                let shape = $('<td>').text(obj[i].shape)
                let details = $('<td>').text(obj[i].details);
                
                if(obj[i].details == 'nonconformant'){
                    succces = 'table-danger';
                }

                console.log(succces)

                $('#tBody')
                    .append(
                      $('<tr class='+succces+'>')
                      .append(id)
                      .append(node)
                      .append(shape)
                      .append(details)
                    ) 
        
            }
               /*  let id = $('<td>').text("0");
                let node = $('<td>').append());
                let shape = showQualify(el.shape,data.shapesPrefixMap);
                let details = $('<td>').append($('<details><pre>').text(el.reason));
                if(typeof shape == 'object'){
                shape = $('<td>').append(shape);
                }else{
                shape = $('<td>').text(shape);
                }
                

                  $('#tBody')
                    .append(
                      $('<tr class='+succces+'>')
                      .append(id)
                      .append(node)
                      .append(shape)
                      .append(details)
                    ) 
                }) */
}