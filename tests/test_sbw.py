import importlib.util
from pathlib import Path
import unittest
spec = importlib.util.spec_from_file_location("sbw", Path(__file__).parents[1]/"tools/sbw.py")
sbw = importlib.util.module_from_spec(spec)
spec.loader.exec_module(sbw)

class Fake:
    def __init__(self, corrupt=False):
        self.memory = {a:255 for a in range(0xc400,0x10000)}
        self.commands=[]
        self.corrupt=corrupt
    def command(self, op, address=0, count=0, data=b""):
        self.commands.append((op,address))
        if op==0: return b"JST-SBW/1 FR2433"
        if op==4:
            for i,b in enumerate(data): self.memory[address+i]=b ^ int(self.corrupt)
        return b""
    def read(self,a,n): return bytes(self.memory[i] for i in range(a,a+2*n))

class Tests(unittest.TestCase):
    def test_wire_crc_and_sequence(self):
        raw=sbw.frame(3,7,data=b"hello")
        self.assertEqual(sbw.decode(raw,3,7)[:5],b"hello")
        for i in range(64):
            damaged=bytearray(raw); damaged[i]^=1
            with self.assertRaises(RuntimeError): sbw.decode(damaged,3,7)
        with self.assertRaises(RuntimeError): sbw.decode(raw,3,8)
    def test_reject_before_usb(self):
        for image in ({},{0xc3ff:0},{0x10000:0},{0xff80:0},{0xff8f:0}):
            p=Fake()
            with self.assertRaises(ValueError): sbw.program(p,image)
            self.assertEqual(p.commands,[])
    def test_boundaries_and_sparse(self):
        blocks=sbw.plan({**{a:1 for a in range(0xc400,0xc481)},0xff80:255,0xfffe:0})
        self.assertTrue(all(len(b)<=24 for b in blocks))
        self.assertEqual(blocks[-1],[0xfffe])
        p=Fake(); p.memory[0xc400]=33
        sbw.program(p,{0xc401:17,0xfffe:0,0xffff:0xc4})
        self.assertEqual(p.memory[0xc400],33)
        self.assertEqual(p.memory[0xc401],17)
        self.assertEqual([a for op,a in p.commands if op==4], [0xc400,0xfffe])
        self.assertEqual(p.commands[-1][0],2)
    def test_corruption_never_releases(self):
        p=Fake(True)
        with self.assertRaisesRegex(RuntimeError,"Verification failed"):
            sbw.program(p,{0xc400:1,0xfffe:0})
        self.assertNotIn(2,[op for op,a in p.commands])
        self.assertNotIn((4,0xfffe),p.commands)
    def test_verify_only(self):
        p=Fake()
        sbw.program(p,{0xc400:255},True)
        self.assertNotIn(4,[op for op,a in p.commands])
    def test_fragmented_serial_and_timeout(self):
        class Serial:
            def write(self,data): self.data=sbw.frame(data[5],data[6]); return len(data)
            def read(self,n): result=self.data[:3]; self.data=self.data[3:]; return result
        self.assertEqual(sbw.Probe(Serial()).command(0),bytes(48))
        class Timeout(Serial):
            def read(self,n): return b""
        with self.assertRaises(TimeoutError): sbw.Probe(Timeout()).command(0)

if __name__=="__main__": unittest.main()
