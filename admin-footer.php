<?php
if ( ! defined( 'ABSPATH' ) ) {
	die( '-1' );
}

global $hook_suffix;
?>

<div class="clear"></div></div>
<div class="clear"></div></div>
<div class="clear"></div></div>

<div id="wpfooter" role="contentinfo">
	<?php
	
	do_action( 'in_admin_footer' );
	?>
	<p id="footer-left" class="alignleft">
		<?php
		echo apply_filters( 'admin_footer_text', '<span id="footer-thankyou">' . $text . '</span>' );
		?>
	</p>
	<p id="footer-upgrade" class="alignright">
		<?php
		echo apply_filters( 'update_footer', '' );
		?>
	</p>
	<div class="clear"></div>
</div>
<?php

do_action( 'admin_footer', '' );


do_action( "admin_print_footer_scripts-{$hook_suffix}" ); 

do_action( 'admin_print_footer_scripts' );


do_action( "admin_footer-{$hook_suffix}" ); 

/
if ( function_exists( 'get_site_option' ) ) {
	if ( false === get_site_option( 'can_compress_scripts' ) ) {
		compression_test();
	}
}

?>

<div class="clear"></div></div>
<script type="text/javascript">if(typeof wpOnload=='function')wpOnload();</script>
</body>
</html>
