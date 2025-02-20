# import decimal
# from interact.infer import Infer

from interact.infer import send_infer

if __name__ == "__main__":
    
    print("Starting the main program")
    
    send_infer()
    # infer_obj = Infer()
    # # Optionally, you can call methods on the infer_obj
    # web3_instance = infer_obj.get_web3()
    # print(f"Web3 connected: {web3_instance.is_connected()}")

    # # Call the infer method to perform inference
    # infer_obj.infer()

   

    # uniswapObj = UniSwapAI()
    # uniswapObj.swap_v3("", SwapReq(
    #     "0x0000000000000000000000000000000000000000",
    #     decimal.Decimal("0.1"),
    #     "0x7d29a64504629172a429e64183d6673b9dacbfce",
    #     decimal.Decimal("0.1")))
