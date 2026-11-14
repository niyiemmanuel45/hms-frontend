// Initialize Bootstrap tooltips after jQuery and Bootstrap are loaded
$(document).ready(function() {
    // Initialize all tooltips
    $('[data-toggle="tooltip"]').tooltip();
    
    // Handle tooltips for portlet tools
    $('.portlet-title .tools > a').each(function() {
        if ($(this).hasClass('remove') || $(this).hasClass('reload') || 
            $(this).hasClass('config') || $(this).hasClass('collapse') || 
            $(this).hasClass('expand') || $(this).hasClass('fullscreen')) {
            $(this).attr('data-toggle', 'tooltip');
        }
    });
    
    // Re-initialize tooltips after dynamic content
    $(document).on('DOMNodeInserted', function(e) {
        $('[data-toggle="tooltip"]').tooltip('destroy').tooltip();
    });
});
