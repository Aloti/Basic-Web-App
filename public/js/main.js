$(document).ready(function(){
    $('.delete-page').on('click', function(e){
        $target = $(e.target);
        const id = $target.attr('data-id');
        $.ajax({
            type:'DELETE',
            url: '/pages/'+id,
            success: function(response){
                alert('Deleteing Page');
                window.location.href='/';
            },
            error: function(err){
                console.log(err);
            }
        })
    })
})