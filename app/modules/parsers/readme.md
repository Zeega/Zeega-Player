          _________*  ________*   ________*     _____*     ___*           
         /\______,  \/\  ______\ /\   _____\   /   ___\   /  __ -         
         \/___ //   /\ \  \____/ \ \  \____/  /\  \___/__/\  \_∆  \       
             //   /   \ \   ____\ \ \   ____\ \ \  \  |  \ \   __  \      
           //   /______\ \  \___/__\ \  \___/__\ \  \__∆  \ \  \/\  \     
          //\___________\ \_________\ \_________\ \_______/  \__\ \__\    
        . .\/___________/\/_________/\/_________/\/______/ .\/__/\/__/ . .


# Parsers

this is where code that dynamically parses different data streams into Zeega data files is housed

each parser module should return valid zeega project data

projects must come in the format:

        {
            [id : Integer,]
            [title : String]
            sequences : [{
                [id : Integer,]
                [title : String,]
                persistent_layers : [ [Integer],…,[Integer] ],
                frames : [ [Integer],…,[Integer] ]
            }],
            frames : [
                {
                    id : Integer,
                    attr : { "advance": [Integer] },
                    layers : [ [Integer],…,[Integer] ]
                }
            ],
            layers : [
                id : Integer,
                type : String,
                [project_id : Integer,]
                attr : { Mixed }
            ]
        }