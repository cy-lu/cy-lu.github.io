function FI = tsai_hill_index(s1, s2, t12, Xt, Xc, Yt, Yc, S)
% tsai_hill_index
% Compute Tsai-Hill failure index using sign-dependent strength selection.

if s1 >= 0
    X = Xt;
else
    X = Xc;
end

if s2 >= 0
    Y = Yt;
else
    Y = Yc;
end

FI = (s1/X)^2 - (s1*s2)/(X^2) + (s2/Y)^2 + (t12/S)^2;
end
