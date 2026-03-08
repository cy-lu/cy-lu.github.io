function [ABD, A, B, D, z, Qbar_all] = build_laminate_ABD(E1,E2,G12,v12,angles,tply)
% build_laminate_ABD
% Construct laminate stiffness matrices A, B, D and full ABD matrix.

v21 = v12 * E2 / E1;
den = 1 - v12*v21;

Q11 = E1 / den;
Q22 = E2 / den;
Q12 = v12 * E2 / den;
Q66 = G12;

nply = length(angles);
h = nply * tply;
z = linspace(-h/2, h/2, nply+1);

A = zeros(3,3);
B = zeros(3,3);
D = zeros(3,3);
Qbar_all = zeros(3,3,nply);

for k = 1:nply
    theta = angles(k);
    m = cosd(theta);
    n = sind(theta);

    Qbar11 = Q11*m^4 + 2*(Q12+2*Q66)*m^2*n^2 + Q22*n^4;
    Qbar22 = Q11*n^4 + 2*(Q12+2*Q66)*m^2*n^2 + Q22*m^4;
    Qbar12 = (Q11+Q22-4*Q66)*m^2*n^2 + Q12*(m^4+n^4);
    Qbar16 = (Q11-Q12-2*Q66)*m^3*n - (Q22-Q12-2*Q66)*m*n^3;
    Qbar26 = (Q11-Q12-2*Q66)*m*n^3 - (Q22-Q12-2*Q66)*m^3*n;
    Qbar66 = (Q11+Q22-2*Q12-2*Q66)*m^2*n^2 + Q66*(m^4+n^4);

    Qbar = [Qbar11 Qbar12 Qbar16;
            Qbar12 Qbar22 Qbar26;
            Qbar16 Qbar26 Qbar66];

    Qbar_all(:,:,k) = Qbar;

    zk1 = z(k);
    zk2 = z(k+1);

    A = A + Qbar * (zk2 - zk1);
    B = B + 0.5 * Qbar * (zk2^2 - zk1^2);
    D = D + (1/3) * Qbar * (zk2^3 - zk1^3);
end

ABD = [A B;
       B D];
end
