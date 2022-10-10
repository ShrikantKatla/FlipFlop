/*--------Object to store complete data of Flip Flop Game--------------- */
let ff_player_profile = null, ff_player_list = null, ff_highscore=null,                   // object to store localstorage object to keep track of game
    game_status = [],                                                                     // array to check game win
    click_count = 0, current_score=0, bonus_val=0,                                        // click_count to check no of cards clicked
    card_first_val = null, card_sec_val = null, card_first_id = null, card_sec_id = null, // to get selected card val and id to check match
    level1_time=30,level2_time=30,level3_time=60,level4_time=120,level5_time=240;         // time for every level
let win="Congratulations",loss="Time OUT",
    current_final_score=0,high_score=0,high_score_name="",current_palyer="",lvl_details=[],current_lvl=""; // variables to track game
let col_start = '<div class="flip-card p-2 d-inline-table">\
                <div class="flip-card-inner rounded ',
    val = '">\
        <div class="flip-card-front">\
          <img src="images/img_front.jpg" alt="img_front" class="img-fluid rounded">\
          <span class="img_txt">',
    txt = '</span>\
        </div>\
        <div class="flip-card-back">\
          <img src="images/img_',
    col_end = '.jpg" alt="flip_img" class="img-fluid rounded">\
                </div>\
            </div>\
        </div>';
        /*col_start--->  parent start div of card
          val ---> Before Val class and id will pass to inner div of parent
          col_end ---> before it the img id will be passed*/
// Function for mobal start Btn
$('#modal_start_btn').click(function () {    
    temp_validation=0;
    select_validate();
    name_validate(); 
    let value = $('#grid_select_id').val(); 
    let name = $('#player_name').val(); 
    if(temp_validation==0){        
        $('#score_table').addClass('d-none');
        $('#main_game_wrapper').removeClass('d-none');
        $('#game_nav').removeClass('d-none');
        $('#reset_game').removeClass('d-none');
        start_game(value,name);
        $(this).attr('data-dismiss', "modal");
        $('#new_game_btn').parent().addClass('d-none');

        }
    
});
// Function for selecting different level while game on 
let select_diff_lvl="",game_going_on="no";
$('.dd-lvl').on('click',function(){
    clearTimeout(time_out);
    select_diff_lvl= $(this).attr('data-value');
    if(game_going_on=="yes"){
        $('#select_diff_lvl').modal({
            show: true
        });
    }else{    
    $('#main_game_wrapper').removeClass('d-none');
    $('#player_profile').addClass('d-none'); 
    $('#reset_game').removeClass('d-none');
    let name = current_palyer; 
    start_game(select_diff_lvl,name);
    }
});
// Function for mobal(while game on) yes btn to start new game over current game 
$('#yes_btn').click(function(){
    $('#main_game_wrapper').removeClass('d-none');
    $('#player_profile').addClass('d-none'); 
    $('#reset_game').removeClass('d-none');
    let name = current_palyer; 
    start_game(select_diff_lvl,name);
});
// Function for mobal(while game on) No btn to reject start new game over current game 
$('#no_btn').click(function(){
    activate_timer(lvl_details);
});
// Function to calculate all time High Score
$('#high_score_btn').click(function(){
    $('#score_table').removeClass('d-none');
    $('#banner_wrapper').addClass('d-none');
    $('#player_profile').addClass('d-none');
    high_score_table();
});
/*Function to reset the current game start new with same level */
$('#reset_game').on('click',function(){
    $('#reset_game, #profile_btn, #dropdown_lvl').prop('disabled',true);
    setTimeout(() => {
        $('#reset_game, #profile_btn, #dropdown_lvl').prop('disabled',false);
    }, 2000);    
    clearTimeout(time_out);
    $('.flip-card-inner').css('transform', 'rotateY(180deg)');
    
    setTimeout(() => {
        $('.flip-card-inner').css('transform', 'rotateY(0deg)');
        setTimeout(() => {
        let value = current_lvl; 
        let name = current_palyer; 
        start_game(value,name);
        }, 1000);
    }, 1000);
});
/*Function to start new with parameter( level details, palyer name)*/
function start_game(value,name){
    $('#game_status').css('width','100%').addClass('game_status_green');
    $('#banner_wrapper').addClass('d-none');
    $('#high_score_btn').addClass('d-none');
    $('#score_table').addClass('d-none');
    storage_check();
    reset_value(); 
    game_going_on="yes";             
        current_palyer=name; 
        current_lvl=value;      
        value=value.split('-');
        lvl_details=value;
        length = (value[0] * value[1]) / 2;
        let newarray =array_shuffle(length);
        $('.game_container').attr('id','grid_'+value[0]);
        let temp_id = 0;
        let final = "";
        newarray.forEach(arr_value => {
            game_status.push('flip_id_' + temp_id);
            let temp = ' flip' + arr_value + '" id="flip_id_' + temp_id + '" value="' + arr_value;
            final += col_start + temp + val + arr_value + txt + arr_value + col_end;
            temp_id++;
        });
        $('.game_container').html(final);
        $('.flip-card').addClass('grid-'+value[0]);
        $('.img_txt').hide();
        validate_profile(name);
        initialize_game_profile(value);
        setTimeout(() => {
            activate_timer(value);
        }, 500);
}
/*Function to reset all the game details */
function reset_value(){
    click_count = 0,
    current_score=0,bonus_val=0,
    card_first_val = null, card_sec_val = null, card_first_id = null, card_sec_id = null,
    current_final_score=0,high_score=0,high_score_name="",current_palyer="",lvl_details=[],game_status=[];
    $('#current_score').text("0");
    $('#bonus_score').text('');
    $('#bonus_time').text('');
}
/*Function to check if player profile is present or not( then create one)  */
function validate_profile(name){
    ff_player_list=JSON.parse(localStorage.getItem('ff_player_list')); 
    ff_player_profile=JSON.parse(localStorage.getItem('ff_player_profile'));
    if(ff_player_list.indexOf(name)==-1){
    
    let new_player_profile= {
        no_games: {
            played:0,win:0,loss:0
        },
        highscore: {
            level1: 0,level2: 0,level3: 0,level4: 0,level5: 0,
        }
    };
    ff_player_list.push(name);
    ff_player_profile[name+"_profile"]=new_player_profile;
    localStorage.setItem('ff_player_profile',JSON.stringify(ff_player_profile));
    localStorage.setItem('ff_player_list',JSON.stringify(ff_player_list));
    }
};
/*Function to reset the current game start new with same level */
function initialize_game_profile(value){
    clearTimeout(time_out);
    $('#user_name').text($('#player_name').val());
    $('#level').text(value[2].slice(value[2].length-1));
    ff_highscore=JSON.parse(localStorage.getItem('ff_highscore'));
    high_score=ff_highscore[value[2]]['highscore'];
    high_score_name=ff_highscore[value[2]]['player_name'];
    $('#high_score').text(ff_highscore[value[2]]['highscore']);
    $('#high_score_name').text(ff_highscore[value[2]]['player_name']);
    $('#timer').attr('data-vale',value[3]).text("Timer : "+value[3]+" sec");    
}
$('#grid_select_id').on('change focusout', select_validate);
$('#player_name').on('focusout', name_validate);
/*Function to validate Select level field */
function select_validate() {
    if ($('#grid_select_id').val() == 'select') {
        $('#select_error_msg').html('* Please Select The Level');
        temp_validation = 1;
    } else {
        $('#select_error_msg').html('');
    }
}
/*Function to validate Player name field */
function name_validate() {
    let name_regex=/(.*[a-z].*)/gi;
    if ($('#player_name').val() == '') {
        $('#name_error_msg').html('* Please Enter Valid Player Name');
        temp_validation = 1;
    }else if($('#player_name').val().length > 8 || $('#player_name').val().length < 3) {
        $('#name_error_msg').html('* Please Enter Name Between 3 to 8 Letters Only');
        temp_validation = 1;
    }
    else if(!name_regex.test($('#player_name').val())) {
        $('#name_error_msg').html('* Please Enter Atleast 1 Alphabet');
        temp_validation = 1;
    }else {
        $('#name_error_msg').html('');
    }
}
/*Function to swap array */
function swap_items(array) {
    var currentIndex = array.length, tempval, randomIndex;
    // While there remain elements to shuffle...
    while (0 !== currentIndex) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        // And swap it with the current element.
        tempval = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = tempval;
    }
    return array;
}
/*Function to shuffle array */
function array_shuffle(length) {
    // array is index of img
    let array = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20];
    // newarray is copy of imgX2 index
    let newarray =[];
    newarray = array.slice(0, length);
    $.merge(newarray, array.slice(0, length));
    newarray = swap_items(newarray);
    return newarray;
};
/*Function to get count of selected card */
$('.game_container').on('click', '.flip-card-inner', function () {
    if (click_count == 0) {
        card_first_val = $(this).attr("value");
        card_first_id = $(this).attr("id");
        $(this).css('transform', 'rotateY(180deg)');
        $('#' + card_first_id).prop('disabled', true);
        click_count += 1;
    }
    else {
        click_count = 0;
        card_sec_val = $(this).attr("value");
        card_sec_id = $(this).attr("id");
        enable_disable(true);
        $(this).css('transform', 'rotateY(180deg)');
        $('#' + card_sec_id).prop('disabled', true);
        (card_first_val == card_sec_val) ? setTimeout(card_match, 1000) : setTimeout(card_unmatch, 1000);              
    }
});
/*Function if card get match */
function card_match() {
    $('.flip' + card_first_val).find('img').animate({ height: '0', width: '0' }, 500);
    $('.flip' + card_sec_val).find('img').animate({ height: '0', width: '0' }, 500);
    bonus_val+=1;
    bonus_print(bonus_val,(lvl_details[2].slice(lvl_details[2].length-1)));
    remove_matched();
    cal_score();    
}
/* Calculate bonus points as per game play*/
function bonus_print(bonus_val,extratime){
    if(bonus_val>1){$('#bonus_score').html('X'+bonus_val).fadeIn(200).delay(300).fadeOut(1000)}else{
        $('#bonus_score').html('&nbsp').fadeIn(200).delay(300).fadeOut(1000);
    }
    if(time>1){
        $('#bonus_time').text('+'+extratime).fadeIn(200).delay(300).fadeOut(1000);
        time=parseInt($('#timer').attr('data-vale'))+parseInt(extratime);
    $('#timer').attr('data-vale',time).text("Timer : "+time+" sec")}; 
}
/*Function to check game win */
function game_win_check(){
    if (game_status.length == 0) {
        clearTimeout(time_out);
        after_game_win();
    }
}
/*Function to remove matched card from game */
function remove_matched() {    
    let index = game_status.indexOf(card_first_id);
    game_status.splice(index, 1);
    let index1 = game_status.indexOf(card_sec_id);
    game_status.splice(index1, 1); 
    setTimeout(() => {
        $('.flip' + card_first_val).remove();
        $('.flip' + card_sec_val).remove();
        enable_disable(false);
        game_win_check();
    }, 500);
};
/*Function to calculate score */
function cal_score() {
    let temp_time = time;
    let temp_current_score = current_score;
    current_score += ((temp_time*96) + 23)*bonus_val;
    $('#current_score').prop('Counter', temp_current_score).animate({
        Counter: current_score
    }, {
            duration: 1000,
            easing: 'swing',
            step: function (now) {
                $('#current_score').html(Math.ceil(now));
            }
        });
    current_final_score=current_score;
    $('#current_score').html(current_score);
}
/*Function if card don't match */
function card_unmatch() {
    $('.flip-card-inner').css('transform', 'rotateY(0deg)');
    $('#' + card_first_id).prop('disabled', false);
    $('#' + card_sec_id).prop('disabled', false);
    $('#bonus_score').html('&nbsp');
    bonus_val=0;
    enable_disable(false);
}
/*Function for enable and disable the card */
function enable_disable(value) {
    $('.flip-card-inner').prop('disabled', value);
}
/*Function after game win */
function after_game_win() {
    modal_content(win);  
    if(current_final_score>ff_player_profile[current_palyer+'_profile']['highscore'][lvl_details[2]])
    ff_player_profile[current_palyer+'_profile']['highscore'][lvl_details[2]]=current_final_score;
    ff_player_profile[current_palyer+'_profile']['no_games']['played']+=1;
    ff_player_profile[current_palyer+'_profile']['no_games']['win']+=1;
    localStorage.setItem('ff_player_profile',JSON.stringify(ff_player_profile));  
    $('.game_container').html('');
    $('#reset_game').addClass('d-none');
}
/*Modal function after game win (win/loss) */
function modal_content(result){    
    $('#modal_header_id').text(result);
    $('#current_final_score').text(current_final_score);
    if((current_final_score>high_score)&& result==win){
        high_score=current_final_score;
        high_score_name=current_palyer;
        ff_highscore[lvl_details[2]]['highscore']=high_score;
        ff_highscore[lvl_details[2]]['player_name']=high_score_name;
        localStorage.setItem('ff_highscore',JSON.stringify(ff_highscore));
        $('#modal_high_score').text("NEW HIGH-SCORE");      
    
    }
    $('#current_high_score_name').text(" ("+high_score_name+" )");
    $('#current_high_score').text(high_score);
    $('#aftergame_modal').modal({
        show: true
    });
}
/*Function to activate the timer as game start */
let time_out,time;
function activate_timer(value) {
    time_out = setInterval(function () {
    time = parseInt($('#timer').attr('data-vale')) - 1;
    $('#timer').attr('data-vale', time).text("Timer : "+time+" sec");
    temp_time = (time / value[3]) * 100;
    set_color(temp_time);
    $('#game_status').css('width', temp_time > 99 ? 100 + "%" : temp_time + "%");
    if (time == 0) {   
        clearTimeout(time_out); 
        setTimeout(function(){
            if (game_status.length == 0) {
                after_game_win();
            }else{
            modal_content(loss);
            ff_player_profile[current_palyer+'_profile']['no_games']['played']+=1;
            ff_player_profile[current_palyer+'_profile']['no_games']['loss']+=1;
            localStorage.setItem('ff_player_profile',JSON.stringify(ff_player_profile));
            $('#reset_game').addClass('d-none');
            };

        },1000);
    }
   }, 1000);
};
/*Function to change the color as per time left */
function set_color(temp_time) {
    if (temp_time > 75) {
        $('#game_status').addClass('game_status_green').removeClass('game_status_yellow').removeClass('game_status_l_orange').removeClass('game_status_orange');
    } else if (temp_time > 50) {
        $('#game_status').addClass('game_status_yellow').removeClass('game_status_green').removeClass('game_status_l_orange').removeClass('game_status_orange');
    } else if (temp_time > 25) {
        $('#game_status').addClass('game_status_l_orange').removeClass('game_status_green').removeClass('game_status_yellow').removeClass('game_status_orange');
    } else {
        $('#game_status').addClass('game_status_orange').removeClass('game_status_green').removeClass('game_status_yellow').removeClass('game_status_l_orange');
    }
}
/*Master key to activate the hack in game ctrl+m*/
$(document).keydown(function(e){
  if( e.which === 77 && e.ctrlKey ){
    $('.img_txt').toggle(); 
  }         
});

/*--------Function to create object in localStorage if not created-------*/
$(document).ready(function () {
    storage_check();
    high_score_table();
});
/*Function to check stroge */
function storage_check(){
    if (!localStorage.getItem('ff_player_profile')||!localStorage.getItem('ff_player_list')||!localStorage.getItem('ff_highscore')) {

        ff_player_profile = {};
        ff_player_list = [];
        ff_highscore = {
            level1: {
                highscore: 0, player_name: "#"
            },
            level2: {
                highscore: 0, player_name: "#"
            },
            level3: {
                highscore: 0, player_name: "#"
            },
            level4: {
                highscore: 0, player_name: "#"
            },
            level5: {
                highscore: 0, player_name: "#"
            }
        };
        localStorage.setItem('ff_player_profile', JSON.stringify(ff_player_profile));
        localStorage.setItem('ff_player_list', JSON.stringify(ff_player_list));
        localStorage.setItem('ff_highscore', JSON.stringify(ff_highscore));
        let a = JSON.parse(localStorage.getItem('ff_player_profile'));
    }
}
/*Function to print high-score in table  */
function high_score_table(){
    ff_highscore=JSON.parse(localStorage.getItem('ff_highscore'));
    for(let i=1;i<=5;i++){
        $('#lvl'+i+'-name').text(ff_highscore['level'+i]['player_name']);
        $('#lvl'+i+'-score').text(ff_highscore['level'+i]['highscore']);
    }
}
/* prevent the form to reload on Enter BTN*/
$('#start_game_form').on('keyup keypress', function(e) {
   var keyCode = e.keyCode || e.which;
   if (keyCode === 13) { 
     e.preventDefault();
     return false;
   }
});
/*Function to print Player profile*/
$('#profile_btn').click(function(){
    clearTimeout(time_out);
    game_going_on="no"; 
    $('#score_table').addClass('d-none');
    $('#main_game_wrapper').addClass('d-none');
    $('.game_container').html("");
    $('#banner_wrapper').addClass('d-none');
    $('#reset_game').addClass('d-none');
    $('#high_score_btn').removeClass('d-none');
    let current_profile=current_palyer+"_profile";
    $('#player_profile').removeClass('d-none');
    $('#player_user_name').text(current_palyer);
    $('#player_no_games').text(ff_player_profile[current_profile]['no_games']['played']);
    $('#player_no_win').text(ff_player_profile[current_profile]['no_games']['win']);
    $('#player_no_loss').text(ff_player_profile[current_profile]['no_games']['loss']);
    $('#player_lvl_1').text(ff_player_profile[current_profile]['highscore']['level1']);
    $('#player_lvl_2').text(ff_player_profile[current_profile]['highscore']['level2']);
    $('#player_lvl_3').text(ff_player_profile[current_profile]['highscore']['level3']);
    $('#player_lvl_4').text(ff_player_profile[current_profile]['highscore']['level4']);
    $('#player_lvl_5').text(ff_player_profile[current_profile]['highscore']['level5']);
});
/* click function will close modal(win/loss) and show banner_wrapper */
$('#ok_btn').click(function(){
  game_going_on="no";
  $('#main_game_wrapper').addClass('d-none');
  $('#banner_wrapper').removeClass('d-none');
  $('#high_score_btn').removeClass('d-none');
});
$('#banner_wrapper').click(function(){
    $('#dropdown_lvl').click();
});
/*Click Function to reload page */
$("#log_out").click(function(){
    location.reload(true);
});
