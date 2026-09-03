import numpy as np
from scipy.linalg import sqrtm, eigvalsh

def ptrace(rho, dims, keep):
    n=len(dims); arr=rho.reshape(tuple(dims)+tuple(dims))
    for ax in sorted(set(range(n))-set(keep), reverse=True):
        arr=np.trace(arr,axis1=ax,axis2=ax+arr.ndim//2)
    dk=int(np.prod([dims[i] for i in keep]))
    return arr.reshape(dk,dk)

def psqrt(a):
    w,v=np.linalg.eigh((a+a.conj().T)/2); return (v*np.sqrt(np.maximum(w,0)))@v.conj().T
def pinvhalf(a):
    w,v=np.linalg.eigh((a+a.conj().T)/2); z=np.where(w>1e-12,1/np.sqrt(w),0); return (v*z)@v.conj().T
def entropy(a):
    w=eigvalsh((a+a.conj().T)/2); w=w[w>1e-14]; return -np.sum(w*np.log2(w))
def fidelity(a,b):
    x=psqrt(a)@b@psqrt(a); return float(np.real(np.trace(psqrt(x)))**2)
def permute_op(op,dims,order):
    n=len(dims); a=op.reshape(tuple(dims)+tuple(dims)); p=order+[i+n for i in order]
    return a.transpose(p).reshape(op.shape)
def petz_recovered(r,dims):
    da,db,dc=dims
    rac=ptrace(r,dims,[0,2]); rc=ptrace(r,dims,[2]); rbc=ptrace(r,dims,[1,2])
    # work order A,C,B. K=rac^.5 * (I_A kron rc^-1/2); middle I_A kron rbc but order A,B,C -> A,C,B
    rac_h=psqrt(rac); rc_i=pinvhalf(rc)
    K=np.kron(rac_h,np.eye(db)) @ np.kron(np.eye(da),np.kron(rc_i,np.eye(db)))
    mid=np.kron(np.eye(da),rbc)
    mid=permute_op(mid,[da,db,dc],[0,2,1])
    out=K@mid@K.conj().T
    return permute_op(out,[da,dc,db],[0,2,1])

rng=np.random.default_rng(12)
for dims in ([2,2,2],[2,2,3],[2,3,2],[3,2,2]):
  d=np.prod(dims); best=(1e9,None)
  for rank in [1,2,3,4,6,d]:
    if rank>d: continue
    for i in range(5000):
      x=rng.normal(size=(d,rank))+1j*rng.normal(size=(d,rank)); r=x@x.conj().T; r/=np.trace(r)
      rec=petz_recovered(r,dims)
      rab=ptrace(r,dims,[0,1]); rac=ptrace(r,dims,[0,2]); rb=ptrace(r,dims,[1]); rc=ptrace(r,dims,[2]); rbc=ptrace(r,dims,[1,2])
      cmi=entropy(rac)+entropy(rbc)-entropy(rc)-entropy(r)
      f=max(min(fidelity(r,rec),1),1e-300)
      gap=cmi+np.log2(f)
      if gap<best[0]: best=(gap,(rank,i,cmi,f))
      if gap < -1e-7:
        print('VIOLATION',dims,gap,rank,i,cmi,f); raise SystemExit
  print('best',dims,best)
