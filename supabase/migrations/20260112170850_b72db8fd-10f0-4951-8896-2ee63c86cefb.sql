-- Create atomic wallet_topup RPC function with proper transaction handling
CREATE OR REPLACE FUNCTION public.wallet_topup(
  _user_id UUID,
  _amount DECIMAL(12, 2)
)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _wallet_id UUID;
  _current_balance DECIMAL(12, 2);
  _new_balance DECIMAL(12, 2);
BEGIN
  -- Validate amount
  IF _amount <= 0 THEN
    RAISE EXCEPTION 'Amount must be greater than 0';
  END IF;
  
  IF _amount > 100000 THEN
    RAISE EXCEPTION 'Maximum top-up is 100000';
  END IF;

  -- Get wallet and lock row for update (prevents race conditions)
  SELECT id, balance INTO _wallet_id, _current_balance
  FROM wallets
  WHERE user_id = _user_id
  FOR UPDATE;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Wallet not found';
  END IF;

  _new_balance := _current_balance + _amount;

  -- Update balance
  UPDATE wallets
  SET balance = _new_balance, updated_at = now()
  WHERE id = _wallet_id;

  -- Insert transaction record (within same transaction - atomic)
  INSERT INTO wallet_transactions (wallet_id, user_id, amount, type, description)
  VALUES (_wallet_id, _user_id, _amount, 'credit', 'Wallet top-up');

  RETURN json_build_object(
    'success', true, 
    'new_balance', _new_balance,
    'amount', _amount,
    'message', concat('₹', _amount::text, ' added to your wallet')
  );
END;
$$;