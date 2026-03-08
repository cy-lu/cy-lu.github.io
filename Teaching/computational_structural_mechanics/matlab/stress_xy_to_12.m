function sigma_12 = stress_xy_to_12(sigma_xy, theta)
% stress_xy_to_12
% Transform global laminate stresses [sx sy txy]^T to ply material stresses [s1 s2 t12]^T

m = cosd(theta);
n = sind(theta);

sx  = sigma_xy(1);
sy  = sigma_xy(2);
txy = sigma_xy(3);

s1  = m^2*sx + n^2*sy + 2*m*n*txy;
s2  = n^2*sx + m^2*sy - 2*m*n*txy;
t12 = -m*n*sx + m*n*sy + (m^2-n^2)*txy;

sigma_12 = [s1; s2; t12];
end
