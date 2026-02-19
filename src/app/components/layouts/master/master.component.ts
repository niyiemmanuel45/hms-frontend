import { Component, OnDestroy, OnInit } from '@angular/core';
import { ScriptLoaderService } from 'src/app/services/shared/script-loader.service';

@Component({
  selector: 'app-master',
  templateUrl: './master.component.html',
  styleUrls: ['./master.component.css']
})
export class MasterComponent implements OnInit, OnDestroy {
  constructor(private scriptLoader: ScriptLoaderService) {}

  ngOnInit(): void {
    // Load dashboard-specific styles and scripts
    this.scriptLoader.loadStyles([
      'https://fonts.googleapis.com/css?family=Source+Sans+Pro:300,400,400i,700&display=fallback',
      'https://code.ionicframework.com/ionicons/2.0.1/css/ionicons.min.css',
      'assets/admin/plugins/fontawesome-free/css/all.min.css',
      'assets/admin/plugins/tempusdominus-bootstrap-4/css/tempusdominus-bootstrap-4.min.css',
      'assets/admin/plugins/icheck-bootstrap/icheck-bootstrap.min.css',
      'assets/admin/admintemplates/css/adminlte.css',
      'assets/admin/plugins/overlayScrollbars/css/OverlayScrollbars.min.css',
      'assets/admin/plugins/sweetalert2-theme-bootstrap-4/bootstrap-4.min.css',
      'assets/admin/plugins/daterangepicker/daterangepicker.css',
      'assets/admin/plugins/summernote/summernote-bs4.min.css',
    ]);
    this.scriptLoader.loadScripts([
      'assets/admin/plugins/jquery/jquery.min.js',
      'assets/admin/plugins/jquery-ui/jquery-ui.min.js',
      'assets/admin/plugins/bootstrap/js/bootstrap.bundle.min.js',
      'assets/admin/plugins/bs-custom-file-input/bs-custom-file-input.min.js',
      'assets/admin/plugins/chart.js/Chart.min.js',
      'assets/admin/plugins/sparklines/sparkline.js',
      'assets/admin/plugins/moment/moment.min.js',
      'assets/admin/plugins/daterangepicker/daterangepicker.js',
      'assets/admin/plugins/tempusdominus-bootstrap-4/js/tempusdominus-bootstrap-4.min.js',
      'assets/admin/plugins/summernote/summernote-bs4.min.js',
      'assets/admin/plugins/overlayScrollbars/js/jquery.overlayScrollbars.min.js',
      'assets/admin/admintemplates/js/adminlte.js',
    ]);
  }

  ngOnDestroy(): void {
    // Unload dashboard-specific styles and scripts
    this.scriptLoader.removeStyles([
      'https://fonts.googleapis.com/css?family=Source+Sans+Pro:300,400,400i,700&display=fallback',
      'https://code.ionicframework.com/ionicons/2.0.1/css/ionicons.min.css',
      'assets/admin/plugins/fontawesome-free/css/all.min.css',
      'assets/admin/plugins/tempusdominus-bootstrap-4/css/tempusdominus-bootstrap-4.min.css',
      'assets/admin/plugins/icheck-bootstrap/icheck-bootstrap.min.css',
      'assets/admin/admintemplates/css/adminlte.css',
      'assets/admin/plugins/overlayScrollbars/css/OverlayScrollbars.min.css',
      'assets/admin/plugins/sweetalert2-theme-bootstrap-4/bootstrap-4.min.css',
      'assets/admin/plugins/daterangepicker/daterangepicker.css',
      'assets/admin/plugins/summernote/summernote-bs4.min.css',
    ]);
    this.scriptLoader.removeScripts([
      'assets/admin/plugins/jquery/jquery.min.js',
      'assets/admin/plugins/jquery-ui/jquery-ui.min.js',
      'assets/admin/plugins/bootstrap/js/bootstrap.bundle.min.js',
      'assets/admin/plugins/bs-custom-file-input/bs-custom-file-input.min.js',
      'assets/admin/plugins/chart.js/Chart.min.js',
      'assets/admin/plugins/sparklines/sparkline.js',
      'assets/admin/plugins/moment/moment.min.js',
      'assets/admin/plugins/daterangepicker/daterangepicker.js',
      'assets/admin/plugins/tempusdominus-bootstrap-4/js/tempusdominus-bootstrap-4.min.js',
      'assets/admin/plugins/summernote/summernote-bs4.min.js',
      'assets/admin/plugins/overlayScrollbars/js/jquery.overlayScrollbars.min.js',
      'assets/admin/admintemplates/js/adminlte.js',
    ]);
  }
}
