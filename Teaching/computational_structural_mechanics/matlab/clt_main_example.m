% clt_main_example.m
% Classical Lamination Theory example
% Symmetric carbon/epoxy laminate: [0/45/-45/90]s

clear; clc;

% -----------------------------
% Lamina elastic properties
% -----------------------------
E1  = 135e9;      % Pa
E2  = 10e9;       % Pa
G12 = 5e9;        % Pa
v12 = 0.30;

% -----------------------------
% Lamina strength properties
% -----------------------------
Xt = 1500e6;      % Pa
Xc = 1200e6;      % Pa
Yt = 40e6;        % Pa
Yc = 150e6;       % Pa
S  = 70e6;        % Pa

% -----------------------------
% Laminate definition
% -----------------------------
angles = [0 45 -45 90 90 -45 45 0];
tply   = 0.125e-3;                 % m

% Load resultant vector [Nx Ny Nxy Mx My Mxy]^T
NM = [1000; 0; 0; 0; 0; 0];

% -----------------------------
% Build laminate ABD
% -----------------------------
[ABD, A, B, D, z, Qbar_all] = build_laminate_ABD(E1,E2,G12,v12,angles,tply);

% Solve for [eps0; kappa]
ek    = ABD \ NM;
eps0  = ek(1:3);
kappa = ek(4:6);

disp('A matrix ='); disp(A)
disp('B matrix ='); disp(B)
disp('D matrix ='); disp(D)

disp('Mid-plane strain eps0 ='); disp(eps0)
disp('Curvature kappa ='); disp(kappa)

% -----------------------------
% Recover ply stresses and FI
% -----------------------------
nply = numel(angles);
sigma12_all = zeros(3, nply);
FI_all = zeros(1, nply);

for k = 1:nply
    zmid = 0.5 * (z(k) + z(k+1));
    eps_xy = eps0 + zmid * kappa;

    sigma_xy = Qbar_all(:,:,k) * eps_xy;
    sigma_12 = stress_xy_to_12(sigma_xy, angles(k));

    s1  = sigma_12(1);
    s2  = sigma_12(2);
    t12 = sigma_12(3);

    sigma12_all(:,k) = sigma_12;
    FI_all(k) = tsai_hill_index(s1, s2, t12, Xt, Xc, Yt, Yc, S);

    fprintf('Ply %d, angle = %+g deg\n', k, angles(k));
    fprintf('sigma_12 = [%.3e %.3e %.3e] Pa\n', s1, s2, t12);
    fprintf('Tsai-Hill FI = %.4f\n\n', FI_all(k));
end

[FImax, kcrit] = max(FI_all);
fprintf('Critical ply = %d, angle = %+g deg, max FI = %.4f\n', kcrit, angles(kcrit), FImax);

% Save results for plotting / later use
save('clt_example_results.mat', 'angles', 'z', 'A', 'B', 'D', 'eps0', 'kappa', 'sigma12_all', 'FI_all');
