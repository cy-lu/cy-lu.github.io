% plot_clt_results.m
% Plot ply stresses and failure index after running clt_main_example.m

clear; clc;
load('clt_example_results.mat');

nply = numel(angles);
ply_id = 1:nply;

figure;
bar(ply_id, sigma12_all(1,:) / 1e6);
xlabel('Ply number');
ylabel('\sigma_1 (MPa)');
title('Longitudinal stress in ply axes');

figure;
bar(ply_id, sigma12_all(2,:) / 1e6);
xlabel('Ply number');
ylabel('\sigma_2 (MPa)');
title('Transverse stress in ply axes');

figure;
bar(ply_id, sigma12_all(3,:) / 1e6);
xlabel('Ply number');
ylabel('\tau_{12} (MPa)');
title('In-plane shear stress in ply axes');

figure;
bar(ply_id, FI_all);
xlabel('Ply number');
ylabel('Failure Index');
title('Tsai-Hill failure index by ply');
